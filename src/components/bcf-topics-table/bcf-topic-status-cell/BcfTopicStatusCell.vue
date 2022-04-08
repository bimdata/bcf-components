<template>
  <span
    class="bcf-status-cell flex items-center justify-center p-x-6"
    :style="{
      'background-color': `#${statusColor}`,
      color: adjustColor(`#${statusColor}`, '#ffffff', 'var(--color-text)')
    }"
  >
    {{ bcfTopic.topicStatus }}
  </span>
</template>

<script>
import { computed } from "@vue/composition-api";
import { DEFAULT_STATUS_COLOR } from "../../../config";
import { adjustColor } from "../../../utils/adjustColor.js";

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
    const statusColor = computed(() => {
      if (props.bcfTopic.topicStatus) {
        const statusDetail = props.detailedExtensions.topicStatuses.find(
          status => status.topicStatus === props.bcfTopic.topicStatus
        );
        if (statusDetail && statusDetail.color) {
          return statusDetail.color;
        }
      }
      return DEFAULT_STATUS_COLOR;
    });

    return {
      // References
      statusColor,
      adjustColor
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicStatusCell.scss"></style>
