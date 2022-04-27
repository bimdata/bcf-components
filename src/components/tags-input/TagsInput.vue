<template>
  <div class="tag-input bimdata-input">
    <input
      type="text"
      v-model="newTag"
      @keydown.enter="addTag(newTag)"
      @keydown.prevent.tab="addTag(newTag)"
      @keydown.delete="newTag.length || removeTag(tags.length - 1)"
    />
    <label for="bimdata-input">
      {{ $t("CreateBcfTopic.tagsLabel") }}
    </label>
    <span class="bar"></span>
    <ul class="tags bimdata-list m-t-6">
      <li
        class="tag flex items-center p-6"
        v-for="(tag, index) in tags"
        :key="tag"
      >
        <span class="m-r-6">
          {{ tag }}
        </span>
        <BIMDataIcon
          name="close"
          size="xxxs"
          fill
          color="granite"
          @click="removeTag(index)"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watchEffect } from "@vue/composition-api";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const tags = ref(props.modelValue);
    const newTag = ref("");

    watchEffect(() => {
      tags.value = props.modelValue;
    });

    const addTag = tag => {
      tags.value.push(tag);
      newTag.value = "";
    };

    const removeTag = index => {
      tags.value.splice(index, 1);
    };

    const onTagsChange = () => {
      emit("update:modelValue", tags.value);
      tags.value = [];
    };

    return {
      tags,
      newTag,
      // Methods
      addTag,
      removeTag,
      onTagsChange
    };
  }
};
</script>

<style scoped lang="scss" src="./TagsInput.scss"></style>
