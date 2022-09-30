<template>
  <div class="bcf-topic-actions-cell">
    <BIMDataButton
      color="primary"
      outline
      radius
      icon
      @click="$emit('open-topic', topic)"
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
    topic: {
      type: Object,
      required: true
    }
  },
  emits: [
    "open-topic"
  ],
};
</script>

<style scoped lang="scss">
.bcf-topic-actions-cell {
  .bimdata-btn {
    margin: auto;
  }
}
</style>
