<template>
  <div
    class="bcf-topic-snapshots-actions flex"
  >
    <BIMDataTooltip
      :disabled="viewpoints.length >= 4"
      :text="$t('BcfComponents.BcfTopicForm.takeSnapshot')"
      color="primary"
      position="right"
    >
      <BIMDataButton
        color="default"
        ghost
        rounded
        icon
        @click="createViewpoints"
        :disabled="viewpoints.length >= 4"
      >
        <BIMDataIconCamera size="s" />
      </BIMDataButton>
    </BIMDataTooltip>
    <BIMDataTooltip
      :disabled="viewpoints.length >= 4"
      :text="$t('BcfComponents.BcfTopicForm.importFile')"
      color="primary"
      position="right"
    >
      <BIMDataButton color="default" ghost rounded icon :disabled="viewpoints.length >= 4">
        <label for="files" class="flex items-center">
          <BIMDataIconUnarchive fill color="default" size="s" />
        </label>
        <input
          :disabled="viewpoints.length >= 4"
          hidden
          id="files"
          type="file"
          multiple
          accept="image/png, image/jpeg"
          @change="uploadViewpoints"
        />
      </BIMDataButton>
    </BIMDataTooltip>
  </div>
</template>

<script>
export default {
  props: {
    viewpoints: {
      type: Array,
      default: () => [],
    },
    getViewers: {
      type: Function,
    },
  },
  emits: ["create-viewpoint"],
  setup(props, { emit }) {
    const createViewpoints = () => {
      const viewers = Object.values(props.getViewers?.() ?? {}).flat();
      viewers.forEach(async (viewer) => {
        const viewpoint = await viewer.getViewpoint();
        emit("create-viewpoint", viewpoint);
      });
    };

    const uploadViewpoints = (event) => {
      [...event.target.files].forEach((file) => {
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
              snapshot_data: reader.result,
            },
          };
          emit("create-viewpoint", viewpoint);
        });
        reader.readAsDataURL(file);
      });
    };

    return {
      // Methods
      createViewpoints,
      uploadViewpoints,
    };
  },
};
</script>
