<template>
  <div class="bcf-topic-snapshots">
    <template v-if="viewpoints.length > 0">
      <div class="bcf-topic-snapshots__snapshots">
        <div
          class="snapshot-preview"
          :class="{ single: viewpoints.length === 1 }"
          v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
          :key="viewpoint.guid || i"
        >
          <img
            v-if="viewpoint.snapshot.snapshotData"
            :src="viewpoint.snapshot.snapshotData"
          />
          <BIMDataButton
            class="btn-delete"
            fill
            rounded
            icon
            @click="deleteViewpoint(viewpoint)"
          >
            <BIMDataIcon name="delete" size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bcf-topic-snapshots__create" @click="takeSnapshots">
        <BIMDataIcon name="camera" size="l" />
      </div>
    </template>
  </div>
</template>

<script>
import { ref, inject, watch } from "@vue/composition-api";
import { getViewpoint2D, getViewpoint3D } from "./snapshot.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
  },
  props: {
    bcfTopic: {
      type: Object
    },
  },
  emits: [
    "add-viewpoint",
    "delete-viewpoint"
  ],
  setup(props, { emit }) {
    const $viewer = inject("$viewer");
    if (!$viewer) {
      console.warn(
        "[BCF Components Snapshot] No $viewer provided by parent components. " +
        "It looks like the component is not used in the context of BIMData Viewer. " +
        "You need to use this component with BIMData Viewer if you want BCF snapshot " +
        "feature to work properly."
      );
    }

    const viewpoints = ref([]);

    watch(
      () => props.bcfTopic,
      topic => {
        viewpoints.value =
          (topic?.viewpoints || []).filter(v => v.snapshot);
      },
      { immediate: true }
    );

    const addViewpoint = viewpoint => {
      viewpoints.value.push(viewpoint);
      emit("add-viewpoint", viewpoint);
    };

    const deleteViewpoint = viewpoint => {
      let index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
      emit("delete-viewpoint", viewpoint);
    };

    const takeSnapshots = async () => {
      if ($viewer) {
        const globalContext = $viewer.globalContext;

        const viewer3d = globalContext.getPlugins("viewer3d")[0];
        const viewer2d = globalContext.getPlugins("viewer2d")[0];
        const viewerDwg = globalContext.getPlugins("dwg")[0];
        const viewerPlan = globalContext.getPlugins("plan")[0];

        if (viewer3d) {
          addViewpoint(getViewpoint3D(viewer3d));
        }
        if (viewer2d) {
          addViewpoint(await getViewpoint2D(viewer2d));
        }
        if (viewerDwg) {
          addViewpoint(await getViewpoint2D(viewerDwg));
        }
        if (viewerPlan) {
          addViewpoint(await getViewpoint2D(viewerPlan));
        }
      } else {
        console.warn("[BCF Components Snapshot] No $viewer provided by parent components.");
      }
    };

    return {
      // References
      viewpoints,
      // Methods
      deleteViewpoint,
      takeSnapshots,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshots.scss"></style>
