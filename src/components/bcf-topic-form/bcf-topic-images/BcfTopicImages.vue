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

      <BIMDataButton
        :disabled="viewpoints.length >= 4"
        class="btn-upload"
        width="100%"
        color="primary"
        fill
        radius
      >
        <label for="files">
          <BIMDataIcon name="camera" size="xs" margin="0 6px 0 0" />
          {{ $t("BcfComponents.BcfTopicForm.addPictureButton") }}
        </label>
        <input
          :disabled="viewpoints.length >= 4"
          hidden
          id="files"
          type="file"
          multiple
          accept="image/png, image/jpeg"
          @change="createViewpoints"
        />
      </BIMDataButton>
    </template>

    <template v-else>
      <div class="bcf-topic-images__upload">
        <span class="icon">
          <BIMDataIcon name="unarchive" size="m" />
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
            @change="createViewpoints"
          />
        </BIMDataButton>
      </div>
    </template>
  </div>
</template>

<script>
import { isTabletOrMobile } from "../../../utils/browser.js";
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
  },
  emits: [
    "create-viewpoint",
    "delete-viewpoint"
  ],
  setup(_, { emit }) {
    const createViewpoints = event => {
      [...event.target.files].forEach(file => {
        let type;
        if (file.type === "image/png") {
          type = "png";
        } else if (file.type === "image/jpeg") {
          type = "jpg"; // `jpeg` is not a valid value, only `jpg` is
        } else {
          type = file.type;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const viewpoint = {
            snapshot: {
              snapshot_type: type,
              snapshot_data: reader.result
            }
          };
          emit("create-viewpoint", viewpoint);
        });
        reader.readAsDataURL(file);
      });
    };

    const deleteViewpoint = viewpoint => {
      emit("delete-viewpoint", viewpoint);
    };

    return {
      // Methods
      createViewpoints,
      deleteViewpoint,
      isTabletOrMobile,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicImages.scss"></style>
