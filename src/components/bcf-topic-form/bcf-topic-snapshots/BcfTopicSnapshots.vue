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
            v-if="viewpoint.snapshot.snapshot_data"
            :src="viewpoint.snapshot.snapshot_data"
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
      <div class="bcf-topic-snapshots__create" @click="createViewpoints">
        <BIMDataIcon name="camera" size="xl" />
      </div>
    </template>
  </div>
</template>

<script>
import { inject } from "vue";
import { VIEWPOINT_CONFIG, VIEWPOINT_MODELS_FIELD, VIEWPOINT_TYPE_FIELD } from "../../../config.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
  },
  props: {
    viewpoints: {
      type: Array,
      default: () => []
    },
  },
  emits: [
    "create-viewpoint",
    "delete-viewpoint"
  ],
  setup(_, { emit }) {
    const getViewers = inject("getViewers", () => ({}));

    const createViewpoints = async () => {
      Object.entries(getViewers()).forEach(([id, viewers]) => {
        const [type, config] =
          Object.entries(VIEWPOINT_CONFIG).find(([, c]) => c.plugin === id);

        viewers.forEach(async viewer => {
          const viewpoint = await viewer.getViewpoint();

          const { order } = config ?? {};
          viewpoint.order = order;
          viewpoint[VIEWPOINT_TYPE_FIELD] = type;
          viewpoint[VIEWPOINT_MODELS_FIELD] = viewer.getLoadedModels().map(m => m.id).join(",");

          emit("create-viewpoint", viewpoint);
        });
      });
    };

    const deleteViewpoint = viewpoint => {
      emit("delete-viewpoint", viewpoint);
    };

    return {
      // Methods
      createViewpoints,
      deleteViewpoint,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshots.scss"></style>
