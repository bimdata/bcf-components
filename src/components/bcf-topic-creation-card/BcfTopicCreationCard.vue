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
      <BIMDataIcon name="plus" size="m" fill color="default" />
    </BIMDataButton>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BcfTopicCreationCardImage from "./BcfTopicCreationCardImage.vue";

export default {
  components: {
    BcfTopicCreationCardImage,
    BIMDataButton,
    BIMDataIcon,
  },
  emits: ["create-topic"],
};
</script>

<style scoped lang="scss" src="./BcfTopicCreationCard.scss"></style>
