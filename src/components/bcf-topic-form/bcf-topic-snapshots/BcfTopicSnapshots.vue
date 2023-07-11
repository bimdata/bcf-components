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
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

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
    getViewers: {
      type: Function,
    },
  },
  emits: [
    "create-viewpoint",
    "delete-viewpoint"
  ],
  setup(props, { emit }) {
    const createViewpoints = () => {
      const viewers = Object.values(props.getViewers?.() ?? {}).flat();
      viewers.forEach(async viewer => {
        const viewpoint = await viewer.getViewpoint();
        emit("create-viewpoint", viewpoint);
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
