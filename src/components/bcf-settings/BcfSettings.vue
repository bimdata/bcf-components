<template>
  <div class="bcf-settings">
    <div class="bcf-settings__header">
      <span>
        {{ $t("BcfComponents.BcfSettings.title") }}
      </span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <div class="bcf-settings__content">
      <div class="bcf-settings__content__text">
        {{ $t("BcfComponents.BcfSettings.text") }}
      </div>
      <SettingCard
        v-for="t in EXTENSION_TYPES"
        :project="project"
        :extensionType="t"
        :availableExtensions="detailedExtensions[EXTENSION_LIST_FIELDS[t]]"
        @create-extension="createExt"
        @update-extension="updateExt"
        @delete-extension="deleteExt"
      />
    </div>
  </div>
</template>

<script>
import { EXTENSION_LIST_FIELDS, EXTENSION_TYPES } from "../../config.js";
import { useService } from "../../service.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import SettingCard from "./setting-card/SettingCard.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    SettingCard,
  },
  props: {
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
    "extension-created",
    "extension-updated",
    "extension-deleted",
    "close"
  ],
  setup(props, { emit }) {
    const {
      createExtension,
      updateExtension,
      deleteExtension,
    } = useService();

    const createExt = async event => {
      const ext = await createExtension(
        event.project,
        event.extensionType,
        event.data
      );
      emit("extension-created", ext);
    };

    const updateExt = async event => {
      const ext = await updateExtension(
        event.project,
        event.extensionType,
        event.extension,
        event.data
      );
      emit("extension-updated", ext);
    };

    const deleteExt = async event => {
      await deleteExtension(
        event.project,
        event.extensionType,
        event.extension
      );
      emit("extension-deleted", event.extension);
    };

    return {
      // References
      EXTENSION_LIST_FIELDS,
      EXTENSION_TYPES,
      // Methods
      createExt,
      updateExt,
      deleteExt,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
