<template>
  <li class="setting-card-item">
    <span v-if="!editMode">
      {{ extension[getExtensionField(extensionType)] }}
    </span>

    <BIMDataInput v-else ref="input" v-model="extensionName" @keyup.enter.stop="submitValue" />

    <div class="setting-card-item__actions">
      <BIMDataButton color="primary" ghost rounded icon @click="editMode = !editMode">
        <BIMDataIcon :name="editMode ? 'close' : 'edit'" size="xxs" />
      </BIMDataButton>
      <BIMDataButton color="high" ghost rounded icon @click="isOpenDeleteGuard = true">
        <BIMDataIconDelete size="xxs" />
      </BIMDataButton>

      <template v-if="EXTENSION_WITH_COLOR.includes(extensionType)">
        <span
          class="setting-card-item__color"
          :style="{
            'border-color': adjustBorderColor(`${extensionColor}`, -50),
            'background-color': `#${extensionColor}`,
          }"
          @click="isOpenColorSelector = true"
        >
        </span>
        <BIMDataColorSelector
          v-if="isOpenColorSelector"
          class="setting-card-item__color-selector"
          v-click-away="() => (isOpenColorSelector = false)"
          :modelValue="extensionColor"
          @update:modelValue="submitColor"
        />
      </template>
    </div>

    <div v-if="isOpenDeleteGuard" class="setting-card-item__delete-guard">
      <p>
        {{ $t("BcfComponents.SettingCard.deleteExtensionText") }}
      </p>
      <div class="flex items-center">
        <BIMDataButton
          class="m-r-6"
          height="28px"
          color="high"
          fill
          radius
          @click="submitDelete(extension)"
        >
          {{ $t("BcfComponents.SettingCard.deleteButton") }}
        </BIMDataButton>
        <BIMDataButton color="primary" ghost rounded icon @click="isOpenDeleteGuard = false">
          <BIMDataIconClose size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
  </li>
</template>

<script>
import { adjustBorderColor } from "@bimdata/design-system/src/BIMDataComponents/BIMDataColorSelector/colors.js";
import { ref, watch } from "vue";
import { EXTENSION_WITH_COLOR } from "../../../config.js";
import { getExtensionField } from "../../../utils/extensions.js";

export default {
  props: {
    extensionType: {
      type: String,
    },
    extension: {
      type: Object,
    },
  },
  emits: ["update-extension", "delete-extension"],
  setup(props, { emit }) {
    const editMode = ref(false);
    const isOpenColorSelector = ref(false);
    const isOpenDeleteGuard = ref(false);

    const extensionName = ref(props.extension[getExtensionField(props.extensionType)]);
    const extensionColor = ref(props.extension.color);

    const input = ref(null);
    watch(editMode, () => setTimeout(() => editMode.value && input.value.focus(), 50));

    const submitValue = async () => {
      if (extensionName.value !== props.extension[getExtensionField(props.extensionType)]) {
        emit("update-extension", {
          extensionType: props.extensionType,
          extension: props.extension,
          data: { value: extensionName.value },
        });
        editMode.value = false;
      }
    };

    const submitColor = async (colorValue) => {
      if (colorValue !== props.extension.color) {
        emit("update-extension", {
          extensionType: props.extensionType,
          extension: props.extension,
          data: { color: colorValue },
        });
        extensionColor.value = colorValue;
      }
    };

    const submitDelete = async (extension) => {
      emit("delete-extension", {
        extensionType: props.extensionType,
        extension,
      });
    };

    return {
      // References
      editMode,
      extensionColor,
      extensionName,
      EXTENSION_WITH_COLOR,
      input,
      isOpenColorSelector,
      isOpenDeleteGuard,
      // Methods
      adjustBorderColor,
      getExtensionField,
      submitColor,
      submitDelete,
      submitValue,
    };
  },
};
</script>

<style scoped lang="scss" src="./SettingCardItem.scss"></style>
