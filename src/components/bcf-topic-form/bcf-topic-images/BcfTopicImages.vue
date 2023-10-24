<template>
  <div class="bcf-topic-images">
    <template v-if="viewpoints.length > 0">
      <div class="bcf-topic-images__images">
        <div
          class="image-preview"
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

      <BIMDataButton
        :disabled="viewpoints.length >= 4"
        class="btn-upload"
        width="100%"
        color="primary"
        fill
        radius
      >
        <label for="files">
          <BIMDataIconCamera size="xs" margin="0 6px 0 0" />
          {{ $t("BcfComponents.BcfTopicForm.addPictureButton") }}
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
    </template>

    <template v-else>
      <div class="bcf-topic-images__upload">
        <span class="icon">
          <BIMDataIconUnarchive size="m" />
        </span>
        <BIMDataButton class="btn-upload" color="primary" outline radius>
          <label v-if="!isTabletOrMobile" for="files">
            {{ $t("BcfComponents.BcfTopicForm.dragDropImageText") }}
          </label>
          <label v-else for="files">
            {{ $t("BcfComponents.BcfTopicForm.dragDropImageTextTablet") }}
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
      </div>
    </template>
  </div>
</template>

<script>
import { isTabletOrMobile } from "../../../utils/browser.js";

export default {
  props: {
    viewpoints: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["upload-viewpoint", "delete-viewpoint"],
  setup() {
    return {
      // Methods
      isTabletOrMobile,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicImages.scss"></style>
