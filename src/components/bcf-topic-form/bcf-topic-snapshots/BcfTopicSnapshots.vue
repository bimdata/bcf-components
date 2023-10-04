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
          <BIMDataButton class="btn-delete" fill rounded icon @click="$emit('delete-viewpoint', viewpoint)">
            <BIMDataIconDelete size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bcf-topic-snapshots__create">
        <BIMDataButton color="primary" fill radius @click="$emit('create-viewpoint')">
          <BIMDataIconCamera size="s" margin="0 6px 0 0" />
          <span>{{ $t("BcfComponents.BcfTopicForm.takeSnapshot") }}</span>
        </BIMDataButton>
        <BIMDataButton color="primary" outline radius class="m-t-12">
          <label for="files" class="flex items-center">
            <BIMDataIconUnarchive fill color="default" size="s" margin="0 6px 0 0" />
            <span>{{ $t("BcfComponents.BcfTopicForm.importFile") }}</span>
          </label>
          <input
            :disabled="viewpoints.length >= 4"
            hidden
            id="files"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            @change="$emit('upload-viewpoint', $event)"
          />
        </BIMDataButton>
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
  emits: ["create-viewpoint", "upload-viewpoint", "delete-viewpoint"],
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshots.scss"></style>
