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
    <div class="bcf-topic-actions-cell__warning" v-if="warning">
      <div class="bcf-topic-actions-cell__warning__white-gradient"></div>
      <BIMDataTooltip :message="warningTooltipMessage" position="left" >
        <div class="bcf-topic-actions-cell__warning__icon">
          <BIMDataIconWarning fill color="warning" />
        </div>
      </BIMDataTooltip>
    </div>
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
    },
    warningTooltipMessage: {
      type: String,
      default: ""
    }
  },
  emits: [
    "open-topic"
  ],
};
</script>

<style scoped lang="scss">
.bcf-topic-actions-cell {
  position: relative;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;

  .bimdata-btn {
    margin: auto;
  }

  &__warning {
    position: absolute;
    top: 0;
    right: 44px;

    display: flex;
    justify-content: flex-end;
    
    &__white-gradient {      
      background: linear-gradient(90deg, transparent, var(--color-white) 90%);
  
      width: 350px;
      height: 42px;
    }

    &__icon {
      box-shadow: var(--box-shadow);

      display: flex;
      justify-content: center;
      align-items: center;

      width: 42px;
      height: 42px;

      background-color: var(--color-white);
    }
  }
}
</style>
