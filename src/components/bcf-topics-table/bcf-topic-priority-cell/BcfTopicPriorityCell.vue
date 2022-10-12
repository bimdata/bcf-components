<template>
  <span
    class="bcf-topic-priority-cell"
    :style="{ color: `#${priorityColor}` }"
  >
    {{ topic.priority || $t("BcfComponents.BcfTopicPriorityCell.noPriority") }}
  </span>
</template>

<script>
import { computed } from "vue";
import { getPriorityColor } from "../../../utils/topic.js";

export default {
  props: {
    detailedExtensions: {
      type: Object,
      required: true
    },
    topic: {
      type: Object,
      required: true
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
.bcf-topic-priority-cell {
  height: 42px;
  padding: 0 calc(var(--spacing-unit) / 2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
</style>
