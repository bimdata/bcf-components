<template>
  <div class="setting-card p-12 m-y-12">
    <div
      class="setting-card__header flex items-center justify-between"
      @click="toggle"
    >
      <strong>{{ $t(`SettingCard.title.${extensionType}`) }}</strong>
      <div class="flex items-center">
        <div
          v-if="availableExtensions"
          class="setting-card__header__length flex items-center justify-center m-r-30"
        >
          <span>{{ availableExtensions.length }}</span>
        </div>
        <BIMDataIcon
          name="chevron"
          size="xxs"
          :rotate="isOpen ? 90 : 0"
          fill
          color="default"
        />
      </div>
    </div>
    <div v-show="isOpen">
      <div
        class="setting-card__subheader flex items-center justify-between m-t-6 m-b-12"
      >
        {{ $t(`SettingCard.text.${extensionType}`) }}
        <BIMDataButton color="default" fill radius @click="toggleAddExtension">
          <BIMDataIcon
            name="plus"
            size="xxxs"
            fill
            color="default"
            margin="0 6px 0 0"
          />
          <span>{{ $t("SettingCard.addButton") }}</span>
        </BIMDataButton>
      </div>
      <transition name="list">
        <div v-if="showAddExtension" class="m-b-12">
          <BIMDataInput
            :placeholder="$t(`SettingCard.input.${extensionType}`)"
            v-model="newExtensionName"
            @keyup.enter.stop="addExtension"
          />

          <div class="flex items-center justify-end">
            <BIMDataButton
              class="m-r-6"
              ghost
              radius
              @click="closeAddExtension"
            >
              {{ $t("SettingCard.cancelButton") }}
            </BIMDataButton>
            <BIMDataButton color="primary" fill radius @click="addExtension">
              {{ $t("SettingCard.validateButton") }}
            </BIMDataButton>
          </div>
        </div>
      </transition>
      <ul class="setting-card__content bimdata-list">
        <Extension
          v-for="extension in availableExtensions"
          :key="extension.id"
          :project="project"
          :extension="extension"
          :extensionType="extensionType"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useBcf } from "../../../composables/bcf.js";
// Compopnents
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import Extension from "./Extension.vue";

// TODO: should be imported from DS
import { getRandomHexColor } from "../../color-selector/colors.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    Extension,
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    availableExtensions: {
      type: Array
    },
    extensionType: {
      type: String
    }
  },
  setup(props) {
    // TODO: could be provided by parent ?
    const { createExtension } = useBcf();

    const isOpen = ref(false);
    const close = () => isOpen.value = false;
    const toggle = () => isOpen.value = !isOpen.value;

    const showAddExtension = ref(false);
    const closeAddExtension = () => {
      newExtensionName.value = "";
      showAddExtension.value = false;
    };
    const toggleAddExtension = () => {
      showAddExtension.value = !showAddExtension.value;
    };

    const newExtensionName = ref("");

    const addExtension = async () => {
      await createExtension(props.project, props.extensionType, {
        priority: newExtensionName.value,
        color: getRandomHexColor()
      });
      closeAddExtension();
    };

    return {
      // References
      isOpen,
      newExtensionName,
      showAddExtension,
      toggle,
      // Methods
      addExtension,
      close,
      closeAddExtension,
      toggleAddExtension,
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
