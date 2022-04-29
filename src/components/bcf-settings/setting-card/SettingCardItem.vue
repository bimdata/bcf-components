<template>
  <li class="setting-card-item">
    <span v-if="!editMode">
      {{ extension[EXTENSION_FIELDS[extensionType]] }}
    </span>

    <BIMDataInput
      v-else
      ref="input"
      v-model="extensionValue"
      @keyup.enter.stop="submitValue"
    />

    <div class="setting-card-item__actions">
      <BIMDataButton
        color="primary"
        ghost rounded icon
        @click="editMode = !editMode"
      >
        <BIMDataIcon :name="editMode ? 'close' : 'edit'" size="xxs" />
      </BIMDataButton>
      <BIMDataButton
        color="high"
        ghost rounded icon
        @click="isOpenDeleteGuard = true"
      >
        <BIMDataIcon name="delete" size="xxs" />
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

    <div
      v-if="isOpenDeleteGuard"
      class="setting-card-item__delete-guard"
    >
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
        <BIMDataButton
          color="primary"
          ghost
          rounded
          icon
          @click="isOpenDeleteGuard = false"
        >
          <BIMDataIcon name="close" size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
  </li>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { EXTENSION_FIELDS, EXTENSION_WITH_COLOR } from "../../../config.js";
import { adjustBorderColor } from "../../../utils/colors.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataColorSelector from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataColorSelector.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";

export default {
  components: {
    BIMDataButton,
    BIMDataColorSelector,
    BIMDataIcon,
    BIMDataInput,
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    extensionType: {
      type: String
    },
    extension: {
      type: Object
    },
  },
  emits: [
    "update-extension",
    "delete-extension"
  ],
  setup(props, { emit }) {
    const editMode = ref(false);
    const isOpenColorSelector = ref(false);
    const isOpenDeleteGuard = ref(false);

    const extensionValue = ref(
      props.extension[EXTENSION_FIELDS[props.extensionType]]
    );
    const extensionColor = ref(props.extension.color);

    const input = ref(null);
    watch(editMode, () =>
      setTimeout(() => editMode.value && input.value.focus(), 50)
    );

    const submitValue = async () => {
      if (
        extensionValue.value !==
        props.extension[EXTENSION_FIELDS[props.extensionType]]
      ) {
        editMode.value = false;
        emit("update-extension", {
          project: props.project,
          extensionType: props.extensionType,
          extension: props.extension,
          data: { value: extensionValue.value }
        });
      }
    };

    const submitColor = async colorValue => {
      if (colorValue !== props.extension.color) {
        extensionColor.value = colorValue;
        emit("update-extension", {
          project: props.project,
          extensionType: props.extensionType,
          extension: props.extension,
          data: { color: colorValue }
        });
      }
    };

    const submitDelete = async extension => {
      emit("delete-extension", {
        project: props.project,
        extensionType: props.extensionType,
        extension,
      });
    };

    return {
      // References
      editMode,
      extensionColor,
      extensionValue,
      EXTENSION_FIELDS,
      EXTENSION_WITH_COLOR,
      input,
      isOpenColorSelector,
      isOpenDeleteGuard,
      // Methods
      adjustBorderColor,
      submitColor,
      submitDelete,
      submitValue,
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCardItem.scss"></style>
