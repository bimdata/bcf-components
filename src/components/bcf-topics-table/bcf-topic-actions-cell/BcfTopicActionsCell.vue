<template>
  <div class="bcf-topic-actions-cell">
    <BIMDataButton
      color="primary"
      outline
      radius
      icon
      @click="$emit('open-topic', topic)"
    >
      <BIMDataIconShow size="xs" />
    </BIMDataButton>
  </div>
</template>

<script>
export default {
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
