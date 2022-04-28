<template>
  <li class="setting-card-item flex items-center justify-between p-x-12 m-b-6">
    <span v-if="!editExtension">
      {{ extension[typeFieldMap[extensionType]] }}
    </span>

    <transition v-else>
      <BIMDataInput
        ref="input"
        v-model="extensionValue"
        @keyup.enter.stop="submitValue"
      />
    </transition>

    <div class="flex items-center">
      <BIMDataIcon
        v-if="!editExtension"
        name="edit"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editExtension = true"
      />
      <BIMDataIcon
        v-else
        name="close"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editExtension = false"
      />
      <BIMDataIcon
        name="delete"
        size="xxs"
        fill
        color="high"
        margin="0 12px 0 0"
        @click="isDeleteSafeZoneOpen = true"
      />

      <template v-if="typesWithColor.includes(extensionType)">
        <span
          class="setting-card-item__color"
          :style="{
            'background-color': `#${extensionColor}`,
            'border-color': adjustBorderColor(`${extensionColor}`, -50)
          }"
          @click="displayColorSelector = true"
        >
        </span>
        <BIMDataColorSelector
          v-if="displayColorSelector"
          v-click-away="() => (displayColorSelector = false)"
          class="setting-card-item__color-selector"
          :modelValue="extensionColor"
          @update:modelValue="submitColor"
        />
      </template>

      <div
        class="setting-card-item__delete__safe-zone flex items-center justify-between p-x-12"
        v-if="isDeleteSafeZoneOpen"
      >
        <p>
          {{ $t("BcfComponents.Extension.deleteExtensionText") }}
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
            {{ $t("BcfComponents.Extension.deleteButton") }}
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            ghost
            rounded
            icon
            @click="isDeleteSafeZoneOpen = false"
          >
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { useBcf } from "../../../composables/bcf.js";
import { adjustBorderColor } from "../../../utils/colors.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataColorSelector from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataColorSelector.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";

const typeFieldMap = {
  Stage: "stage",
  Priority: "priority",
  Label: "label",
  Type: "topicType",
  Status: "topicStatus"
};

const typesWithColor = ["Status", "Priority"];

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
    extension: {
      type: Object
    },
    extensionType: {
      type: String
    }
  },
  setup(props) {
    // TODO: could be provided by parent ?
    const { updateExtension, deleteExtension } = useBcf();

    const editExtension = ref(false);
    const displayColorSelector = ref(false);
    const isDeleteSafeZoneOpen = ref(false);

    const extensionValue = ref(
      props.extension[typeFieldMap[props.extensionType]]
    );
    const extensionColor = ref(props.extension.color);

    const input = ref(null);
    watch(editExtension, () =>
      setTimeout(() => editExtension.value && input.value.focus(), 50)
    );

    const submitValue = async () => {
      if (
        extensionValue.value !==
        props.extension[typeFieldMap[props.extensionType]]
      ) {
        const data = {};
        data[typeFieldMap[props.extensionType]] = extensionValue.value;

        await updateExtension(
          props.project,
          props.extensionType,
          props.extension.id,
          data
        );
        editExtension.value = false;
      }
    };

    const submitColor = async colorValue => {
      if (colorValue !== props.extension.color) {
        await updateExtension(
          props.project,
          props.extensionType,
          props.extension.id,
          {
            color: colorValue
          }
        );
        extensionColor.value = colorValue;
      }
    };

    const submitDelete = async extension => {
      await deleteExtension(
        props.project,
        props.extensionType,
        extension
      );
    };

    return {
      // References
      displayColorSelector,
      editExtension,
      extensionColor,
      extensionValue,
      input,
      isDeleteSafeZoneOpen,
      typeFieldMap,
      typesWithColor,
      // Methods
      adjustBorderColor,
      submitColor,
      submitDelete,
      submitValue,
    };
  }
};
</script>

<style scoped lang="scss" src="./Extension.scss"></style>
