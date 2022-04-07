<template>
  <div class="bcf-settings">
    <div class="bcf-settings__header flex items-center justify-between p-x-18">
      <BIMDataButton color="default" ripple radius icon @click="$emit('close')">
        <BIMDataIcon
          name="arrow"
          size="xxs"
          fill
          color="default"
          margin="0 6px 0 0"
        />
        <span>{{ $t("BcfSettings.goBackButton") }}</span>
      </BIMDataButton>
      <span>
        {{ $t("BcfSettings.title") }}
      </span>
      <BIMDataIcon
        name="close"
        size="xxs"
        fill
        color="default"
        @click="$emit('close')"
      />
    </div>
    <div class="bcf-settings__content flex justify-between p-b-18">
      <div class="bcf-settings__content__settings p-18">
        <p class="m-b-24 p-x-48 text-center color-granite">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <SettingCard
          extensionType="Priority"
          :availableExtensions="detailedExtensions.priorities"
        />
        <SettingCard
          extensionType="Type"
          :availableExtensions="detailedExtensions.topicTypes"
        />
        <SettingCard
          extensionType="Stage"
          :availableExtensions="detailedExtensions.stages"
        />
        <SettingCard
          extensionType="Status"
          :availableExtensions="detailedExtensions.topicStatuses"
        />
        <SettingCard
          extensionType="Label"
          :availableExtensions="detailedExtensions.topicLabels"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from "@vue/composition-api";
import { useBcf } from "../../composables/bcf.js";
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
    }
  },
  emits: ["close"],
  setup(props) {
    const { detailedExtensions, loadDetailedExtensions } = useBcf();

    watch(
      () => props.project,
      async () => (await loadDetailedExtensions(props.project)),
      { immediate: true }
    );

    return {
      detailedExtensions
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
