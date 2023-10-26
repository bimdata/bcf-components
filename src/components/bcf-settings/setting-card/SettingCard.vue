<template>
  <div class="setting-card">
    <div class="setting-card__header" @click="toggle">
      <div class="setting-card__header__text">
        {{ $t(`BcfComponents.SettingCard.title.${extensionType}`) }}
      </div>
      <div class="setting-card__header__icons">
        <div v-if="availableExtensions" class="count">
          {{ availableExtensions.length }}
        </div>
        <BIMDataIconChevron size="xxs" :rotate="isOpen ? 90 : 0" />
      </div>
    </div>
    <div v-show="isOpen">
      <div class="setting-card__subheader">
        {{ $t(`BcfComponents.SettingCard.text.${extensionType}`) }}
        <BIMDataButton fill radius @click="toggleForm">
          <BIMDataIconPlus margin="0 6px 0 0" size="xxxs" fill />
          <span>
            {{ $t("BcfComponents.SettingCard.addButton") }}
          </span>
        </BIMDataButton>
      </div>

      <transition name="slide-fade-up">
        <div v-show="isOpenForm" class="setting-card__form">
          <BIMDataInput
            ref="input"
            :placeholder="$t(`BcfComponents.SettingCard.input.${extensionType}`)"
            v-model="name"
            @keyup.enter.stop="addExtension"
          />

          <div class="actions">
            <BIMDataButton ghost radius @click="closeForm">
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
          :extensionType="extensionType"
          :extension="extension"
          @update-extension="$emit('update-extension', $event)"
          @delete-extension="$emit('delete-extension', $event)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { getAvailableExtensions } from "../../../utils/extensions.js";
// Compopnents
import SettingCardItem from "./SettingCardItem.vue";

export default {
  components: {
    SettingCardItem,
  },
  props: {
    detailedExtensions: {
      type: Object,
      required: true,
    },
    extensionType: {
      type: String,
      required: true,
    },
  },
  emits: ["create-extension", "update-extension", "delete-extension"],
  setup(props, { emit }) {
    const availableExtensions = computed(() =>
      getAvailableExtensions(props.extensionType, props.detailedExtensions)
    );

    const input = ref(null);
    const name = ref("");

    const isOpen = ref(false);
    const close = () => (isOpen.value = false);
    const toggle = () => (isOpen.value = !isOpen.value);

    const isOpenForm = ref(false);
    const closeForm = () => {
      name.value = "";
      isOpenForm.value = false;
    };
    const toggleForm = () => {
      isOpenForm.value = !isOpenForm.value;
      if (isOpenForm.value) {
        setTimeout(() => input.value.focus(), 50);
      }
    };

    const addExtension = async () => {
      emit("create-extension", {
        extensionType: props.extensionType,
        data: { value: name.value },
      });
      closeForm();
    };

    return {
      // References
      availableExtensions,
      input,
      isOpen,
      isOpenForm,
      name,
      // Methods
      addExtension,
      close,
      closeForm,
      toggle,
      toggleForm,
    };
  },
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
