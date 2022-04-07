<template>
  <span
    class="bcf-topic-priority-cell flex items-center justify-center p-x-6"
    :class="`bcf-topic-priority-cell--${priorityValue}`"
  >
    {{ bcfTopic.priority }}
  </span>
</template>

<script>
import { computed } from "@vue/composition-api";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const priorityValue = computed(() => {
      if (props.bcfTopic.priority) {
        return props.bcfTopic.priority.toLowerCase();
      }
      return "";
    });

    return {
      // References
      priorityValue
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicPriorityCell.scss"></style>
