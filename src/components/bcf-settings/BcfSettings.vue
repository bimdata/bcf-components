<template>
  <div class="bcf-settings">
    <div class="bcf-settings__header">
      <BIMDataButton color="default" ripple radius @click="$emit('close')">
        <BIMDataIcon
          name="arrow"
          size="xxs"
          fill
          color="default"
          margin="0 6px 0 0"
        />
        <span>{{ $t("BcfComponents.BcfSettings.goBackButton") }}</span>
      </BIMDataButton>
      <span>
        {{ $t("BcfComponents.BcfSettings.title") }}
      </span>
      <BIMDataIcon
        name="close"
        size="xxs"
        fill
        color="default"
        @click="$emit('close')"
      />
    </div>
    <div class="bcf-settings__content">
      <div class="bcf-settings__content__text">
        {{ $t("BcfComponents.BcfSettings.text") }}
      </div>
      <SettingCard
        :project="project"
        :availableExtensions="detailedExtensions.priorities"
        extensionType="Priority"
      />
      <SettingCard
        :project="project"
        :availableExtensions="detailedExtensions.topicTypes"
        extensionType="Type"
      />
      <SettingCard
        :project="project"
        :availableExtensions="detailedExtensions.stages"
        extensionType="Stage"
      />
      <SettingCard
        :project="project"
        :availableExtensions="detailedExtensions.topicStatuses"
        extensionType="Status"
      />
      <SettingCard
        :project="project"
        :availableExtensions="detailedExtensions.topicLabels"
        extensionType="Label"
      />
    </div>
  </div>
</template>

<script>
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
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
