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
            v-if="viewpoint.snapshot.snapshotData"
            :src="viewpoint.snapshot.snapshotData"
          />
          <BIMDataButton
            class="btn-delete"
            fill
            rounded
            icon
            @click="delImage(viewpoint)"
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
          @change="addImage"
        />
      </BIMDataButton>
    </template>

    <template v-else>
      <div class="bcf-topic-images__upload">
        <span class="icon">
          <BIMDataIcon name="unarchive" size="m" />
        </span>
        <BIMDataButton class="btn-upload" color="primary" outline radius>
          <label for="files">
            {{ $t("BcfComponents.BcfTopicForm.dragDropImageText") }}
          </label>
          <input
            hidden
            id="files"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            @change="addImage"
          />
        </BIMDataButton>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
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
    "add-image",
    "del-image"
  ],
  setup(props, { emit }) {
    const viewpoints = ref([]);

    watch(
      () => props.bcfTopic,
      topic => {
        viewpoints.value =
          (topic?.viewpoints || []).filter(v => v.snapshot);
      },
      { immediate: true }
    );

    const addImage = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const viewpoint = {
            snapshot: {
              snapshotType: file.type,
              snapshotData: reader.result
            }
          };
          viewpoints.value.push(viewpoint)
          emit("add-image", viewpoint);
        });
        reader.readAsDataURL(file);
      });
    };

    const delImage = viewpoint => {
      let index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
      emit("del-image", viewpoint);
    };

    return {
      // References
      viewpoints,
      // Methods
      addImage,
      delImage,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicImages.scss"></style>
