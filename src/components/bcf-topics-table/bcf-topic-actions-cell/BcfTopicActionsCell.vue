<template>
  <div class="bcf-topic-actions-cell">
    <BIMDataButton
      color="primary"
      outline
      radius
      icon
      @click="$emit('open-bcf-topic', bcfTopic)"
    >
      <BIMDataIcon name="show" size="xs" />
    </BIMDataButton>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";

export default {
  components: {
    BIMDataButton,
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: [
    "open-bcf-topic"
  ],
};
</script>

<style scoped lang="scss" src="./BcfTopicActionsCell.scss"></style>
