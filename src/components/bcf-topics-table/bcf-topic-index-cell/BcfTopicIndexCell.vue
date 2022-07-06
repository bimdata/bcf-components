<template>
  <div class="bcf-topic-index-cell">
    <span
      class="left-stripe"
      :style="{ backgroundColor: `#${priorityColor}` }"
    ></span>
    <span class="index">
      {{ bcfTopic.index }}
    </span>
  </div>
</template>

<script>
import { computed } from "vue";
import { getPriorityColor } from "../../../utils/topic.js";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true,
    },
    detailedExtensions: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const priorityColor = computed(
      () => getPriorityColor(props.bcfTopic, props.detailedExtensions)
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
