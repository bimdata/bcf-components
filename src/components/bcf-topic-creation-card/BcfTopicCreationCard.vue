<template>
  <BIMDataCard class="bcf-topic-creation-card flex items-center justify-center">
    <template #content>
      <BcfTopicCreationCardImage />
      <p class="color-primary m-y-24">{{ $t("BcfTopicCreationCard.text") }}</p>
      <BIMDataButton
        width="40px"
        height="40px"
        color="default"
        fill
        radius
        icon
        @click="$emit('create-bcf-topic')"
      >
        <BIMDataIcon name="plus" size="m" fill color="default" />
      </BIMDataButton>
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataCard.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BcfTopicCreationCardImage from "./BcfTopicCreationCardImage.vue";

export default {
  components: {
    BcfTopicCreationCardImage,
    BIMDataButton,
    BIMDataCard,
    BIMDataIcon,
  },
  emits: ["create-bcf-topic"],
};
</script>

<style scoped lang="scss" src="./BcfTopicCreationCard.scss"></style>
