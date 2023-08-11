<template>
  <div class="bcf-topic-creation-card">
    <BcfTopicCreationCardImage />
    <div class="bcf-topic-creation-card__text">
      {{ $t("BcfComponents.BcfTopicCreationCard.text") }}
    </div>
    <BIMDataButton
      width="48px"
      height="48px"
      color="default"
      fill
      radius
      icon
      @click="$emit('create-topic')"
    >
      <BIMDataIconPlus size="m" fill color="default" />
    </BIMDataButton>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/src/BIMDataComponents/BIMDataButton/BIMDataButton.vue";
import BIMDataIconPlus from "@bimdata/design-system/src/BIMDataComponents/BIMDataIcon/BIMDataIconStandalone/BIMDataIconPlus.vue";
import BcfTopicCreationCardImage from "./BcfTopicCreationCardImage.vue";

export default {
  components: {
    BcfTopicCreationCardImage,
    BIMDataButton,
    BIMDataIconPlus,
  },
  emits: ["create-topic"],
};
</script>

<style scoped lang="scss" src="./BcfTopicCreationCard.scss"></style>
