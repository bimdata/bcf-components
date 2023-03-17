<template>
  <div class="bcf-settings">
    <div class="bcf-settings__header">
      <BIMDataButton
        v-if="uiConfig.backButton"
        color="granite"
        ghost
        rounded
        icon
        @click="$emit('back')"
      >
        <BIMDataIcon name="arrow" size="xxs" />
      </BIMDataButton>
      <span class="bcf-settings__header__title">
        {{ $t("BcfComponents.BcfSettings.title") }}
      </span>
      <BIMDataButton
        v-if="uiConfig.closeButton"
        color="granite"
        ghost
        rounded
        icon
        @click="$emit('close')"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>

    <div class="bcf-settings__content">
      <div class="bcf-settings__content__text">
        {{ $t("BcfComponents.BcfSettings.text") }}
      </div>
      <SettingCard
        v-for="t in EXTENSION_TYPES"
        :detailedExtensions="detailedExtensions"
        :extensionType="t"
        @create-extension="createExtension"
        @update-extension="updateExtension"
        @delete-extension="deleteExtension"
      />
    </div>
  </div>
</template>

<script>
import { EXTENSION_TYPES } from "../../config.js";
import { useService } from "../../service.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import SettingCard from "./setting-card/SettingCard.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    SettingCard,
  },
  props: {
    uiConfig: {
      type: Object,
      default: () => ({
        backButton: false,
        closeButton: false,
      })
    },
    project: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    },
  },
  emits: [
    "back",
    "close",
    "extension-created",
    "extension-updated",
    "extension-deleted",
  ],
  setup(props, { emit }) {
    const service = useService();

    const createExtension = async event => {
      const ext = await service.createExtension(
        props.project,
        event.extensionType,
        event.data
      );
      emit("extension-created", ext);
    };

    const updateExtension = async event => {
      const ext = await service.updateExtension(
        props.project,
        event.extensionType,
        event.extension,
        event.data
      );
      emit("extension-updated", ext);
    };

    const deleteExtension = async event => {
      await service.deleteExtension(
        props.project,
        event.extensionType,
        event.extension
      );
      emit("extension-deleted", event.extension);
    };

    return {
      // References
      EXTENSION_TYPES,
      // Methods
      createExtension,
      updateExtension,
      deleteExtension,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
