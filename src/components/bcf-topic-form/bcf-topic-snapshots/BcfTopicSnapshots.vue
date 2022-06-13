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
        <BIMDataIcon name="camera" size="xl" />
      </div>
    </template>
  </div>
</template>

<script>
import { ref, inject, watch } from "@vue/composition-api";
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
    const getViewers = inject("getViewers", () => {});

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
      Object.values(getViewers()).forEach(async viewer => {
        if (viewer) {
          addViewpoint(await viewer.getViewpoint());
        }
      });
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
