<template>
  <div class="bcf-topic-index-cell">
    <span
      class="left-stripe"
      :style="{ backgroundColor: `#${priorityColor}` }"
    ></span>
    <span class="index">
      {{ topic.index }}
    </span>
  </div>
</template>

<script>
import { computed } from "vue";
import { getPriorityColor } from "../../../utils/topic.js";

export default {
  props: {
    detailedExtensions: {
      type: Object,
      required: true,
    },
    topic: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const priorityColor = computed(
      () => getPriorityColor(props.topic, props.detailedExtensions)
    );

    return {
      // References
      priorityColor,
    };
  }
};
</script>

<style scoped lang="scss">
.bcf-topic-index-cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .left-stripe {
    position: absolute;
    left: calc(0px - var(--spacing-unit));
    width: 10px;
    height: 42px;
  }
}
</style>
