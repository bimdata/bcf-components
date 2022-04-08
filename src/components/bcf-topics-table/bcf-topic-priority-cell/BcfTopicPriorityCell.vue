<template>
  <span
    class="bcf-topic-priority-cell flex items-center justify-center p-x-6"
    :style="{ color: `#${priorityColor}` }"
  >
    {{ bcfTopic.priority || $t("BcfTopicGridItem.noPriority") }}
  </span>
</template>

<script>
import { computed } from "@vue/composition-api";
import { DEFAULT_PRIORITY_COLOR } from "../../../config";

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
    const priorityColor = computed(() => {
      if (props.bcfTopic.priority) {
        const priorityDetail = props.detailedExtensions.priorities.find(
          priority => priority.priority === props.bcfTopic.priority
        );
        if (priorityDetail?.color) {
          return priorityDetail.color;
        }
      }
      return DEFAULT_PRIORITY_COLOR;
    });

    return {
      // References
      priorityValue: priorityColor
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicPriorityCell.scss"></style>
