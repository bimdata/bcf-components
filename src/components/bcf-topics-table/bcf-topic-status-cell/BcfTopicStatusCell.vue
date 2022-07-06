<template>
  <span
    class="bcf-topic-status-cell"
    :style="{
      backgroundColor: `#${statusColor}`,
      color: adjustTextColor(statusColor, '#ffffff', 'var(--color-text)')
    }"
  >
    {{ bcfTopic.topicStatus }}
  </span>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/dist/colors.js";
import { computed } from "vue";
import { getStatusColor } from "../../../utils/topic.js";

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
    const statusColor = computed(
      () => getStatusColor(props.bcfTopic, props.detailedExtensions)  
    );

    return {
      // References
      statusColor,
      // Methods
      adjustTextColor,
    };
  }
};
</script>

<style scoped lang="scss">
.bcf-topic-status-cell {
  height: 42px;
  padding: 0 calc(var(--spacing-unit) / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
