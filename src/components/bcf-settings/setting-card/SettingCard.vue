<template>
  <div class="setting-card">
    <div
      class="setting-card__header"
      @click="toggle"
    >
      <div class="setting-card__header__text">
        {{ $t(`BcfComponents.SettingCard.title.${extensionType}`) }}
      </div>
      <div class="setting-card__header__icons">
        <div
          v-if="availableExtensions"
          class="count"
        >
          {{ availableExtensions.length }}
        </div>
        <BIMDataIcon
          name="chevron"
          size="xxs"
          :rotate="isOpen ? 90 : 0"
        />
      </div>
    </div>
    <div v-show="isOpen">
      <div class="setting-card__subheader">
        {{ $t(`BcfComponents.SettingCard.text.${extensionType}`) }}
        <BIMDataButton fill radius @click="toggleAddExtension">
          <BIMDataIcon
            margin="0 6px 0 0"
            name="plus"
            size="xxxs"
            fill
          />
          <span>
            {{ $t("BcfComponents.SettingCard.addButton") }}
          </span>
        </BIMDataButton>
      </div>

      <transition name="slide-fade-up">
        <div v-show="isOpenAddExtension" class="setting-card__add-form">
          <BIMDataInput
            ref="input"
            :placeholder="$t(`BcfComponents.SettingCard.input.${extensionType}`)"
            v-model="name"
            @keyup.enter.stop="addExtension"
          />

          <div class="actions">
            <BIMDataButton ghost radius @click="closeAddExtension">
              {{ $t("BcfComponents.SettingCard.cancelButton") }}
            </BIMDataButton>
            <BIMDataButton color="primary" fill radius @click="addExtension">
              {{ $t("BcfComponents.SettingCard.validateButton") }}
            </BIMDataButton>
          </div>
        </div>
      </transition>

      <ul class="setting-card__content bimdata-list">
        <SettingCardItem
          v-for="extension in availableExtensions"
          :key="extension.id"
          :project="project"
          :extension="extension"
          :extensionType="extensionType"
          @update-extension="$emit('update-extension', $event)"
          @delete-extension="$emit('delete-extension', $event)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { EXTENSION_WITH_COLOR } from "../../../config.js";
import { getRandomHexColor } from "../../../utils/colors.js";
// Compopnents
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import SettingCardItem from "./SettingCardItem.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    SettingCardItem,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    extensionType: {
      type: String,
      required: true,
    },
    availableExtensions: {
      type: Array,
      required: true,
    },
  },
  emits: [
    "create-extension",
    "update-extension",
    "delete-extension"
  ],
  setup(props, { emit }) {
    const input = ref(null);
    const name = ref("");

    const isOpen = ref(false);
    const close = () => isOpen.value = false;
    const toggle = () => isOpen.value = !isOpen.value;
    
    const isOpenAddExtension = ref(false);
    const closeAddExtension = () => {
      name.value = "";
      isOpenAddExtension.value = false;
    };
    const toggleAddExtension = () => {
      isOpenAddExtension.value = !isOpenAddExtension.value;
    };

    watch(isOpenAddExtension, () =>
      setTimeout(() => isOpenAddExtension.value && input.value.focus(), 50)
    );

    const addExtension = async () => {
      closeAddExtension();
      emit("create-extension", {
        project: props.project,
        extensionType: props.extensionType,
        data: {
          value: name.value,
          color: EXTENSION_WITH_COLOR.includes(props.extensionType)
            ? getRandomHexColor()
            : undefined
        }
      });
    };

    return {
      // References
      input,
      isOpen,
      isOpenAddExtension,
      name,
      // Methods
      addExtension,
      close,
      closeAddExtension,
      toggle,
      toggleAddExtension,
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
