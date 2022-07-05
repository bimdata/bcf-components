<template>
  <span
    class="bcf-topic-priority-cell"
    :style="{ color: `#${priorityColor}` }"
  >
    {{ bcfTopic.priority || $t("BcfComponents.BcfTopicPriorityCell.noPriority") }}
  </span>
</template>

<script>
import { computed } from "vue";
import { getPriorityColor } from "../../../utils/topic.js";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    }
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

<style scoped lang="scss" src="./BcfTopicPriorityCell.scss"></style>
