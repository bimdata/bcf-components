<template>
  <div
    class="bcf-topic-snapshots-actions flex"
  >
    <BIMDataTooltip
      :disabled="snapshotedViewpoints.length > 0"
      :text="$t('BcfComponents.BcfTopicForm.takeSnapshot')"
      color="primary"
      position="right"
    >
      <BIMDataButton
        color="default"
        ghost
        rounded
        icon
        @click="$emit('create-viewpoint')"
        :disabled="snapshotedViewpoints.length > 0"
      >
        <BIMDataIconCamera size="s" />
      </BIMDataButton>
    </BIMDataTooltip>
    <BIMDataTooltip
      :text="$t('BcfComponents.BcfTopicForm.importFile')"
      color="primary"
      position="right"
    >
      <BIMDataButton color="default" ghost rounded icon >
        <label for="files" class="flex items-center">
          <BIMDataIconUnarchive fill color="default" size="s" />
        </label>
        <input
          hidden
          id="files"
          type="file"
          multiple
          accept="image/png, image/jpeg"
          @change="$emit('upload-viewpoint', $event)"
        />
      </BIMDataButton>
    </BIMDataTooltip>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    viewpoints: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["create-viewpoint", "upload-viewpoint"],
  setup(props) {
    // Computed filtering viewpoints on isUpload = false
    const snapshotedViewpoints = computed(() =>
      props.viewpoints.filter((viewpoint) => !viewpoint.isUpload)
    );

    return {
      snapshotedViewpoints,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshotsActions.scss"></style>