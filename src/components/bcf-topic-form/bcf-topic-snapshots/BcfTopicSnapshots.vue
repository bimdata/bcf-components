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
          <img v-if="viewpoint.snapshot.snapshot_data" :src="viewpoint.snapshot.snapshot_data" />
          <BIMDataButton class="btn-delete" fill rounded icon @click="deleteViewpoint(viewpoint)">
            <BIMDataIconDelete size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bcf-topic-snapshots__create">
        <BcfTopicSnapshotsActions
          :viewpoints="viewpoints"
          :getViewers="getViewers"
          @create-viewpoint="$emit('create-viewpoint', $event)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import BcfTopicSnapshotsActions from "../bcf-topic-snapshots-actions/BcfTopicSnapshotsActions.vue";
// Components
import BIMDataButton from "@bimdata/design-system/src/BIMDataComponents/BIMDataButton/BIMDataButton.vue";
import {
  BIMDataIconDelete,
  BIMDataIconCamera,
} from "@bimdata/design-system/src/BIMDataComponents/BIMDataIcon/BIMDataIconStandalone/index.js";

export default {
  components: {
    BcfTopicSnapshotsActions,
    BIMDataButton,
    BIMDataIconDelete,
    BIMDataIconCamera,
  },
  props: {
    viewpoints: {
      type: Array,
      default: () => [],
    },
    getViewers: {
      type: Function,
    },
  },
  emits: ["create-viewpoint", "delete-viewpoint"],
  setup(props, { emit }) {
    const deleteViewpoint = (viewpoint) => {
      emit("delete-viewpoint", viewpoint);
    };

    return {
      // Methods
      deleteViewpoint,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshots.scss"></style>
