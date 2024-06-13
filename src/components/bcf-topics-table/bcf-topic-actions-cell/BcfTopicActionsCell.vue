<template>
  <div class="bcf-topic-actions-cell">
    <BIMDataButton
      :color="warning ? 'secondary' : 'primary'"
      outline
      radius
      icon
      @click="$emit('open-topic', topic)"
    >
      <BIMDataIconShow size="xs" :color="warning ? 'warning' : 'primary'" fill/>
    </BIMDataButton>
  </div>
</template>

<script>
export default {
  props: {
    topic: {
      type: Object,
      required: true
    },
    warning: {
      type: Boolean,
      default: false
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
