<template>
  <div
    class="bcf-topic-viewpoints"
    :class="{ empty: viewpoints.length === 0 }"
  >
    <div
      v-if="bcfTopic.topic_status"
      class="status-badge"
      :style="{
        backgroundColor: `#${statusColor}`,
        color: adjustTextColor(`#${statusColor}`, '#FFF', '#2F374A')
      }"
    >
      <BIMDataIcon name="information" fill color="default" />
      <span>{{ bcfTopic.topic_status }}</span>
    </div>
    <template v-if="viewpoints.length > 0">
      <BIMDataCarousel :sliderPadding="0">
        <div
          class="snapshot-preview"
          v-for="viewpoint in viewpoints"
          :key="viewpoint.guid"
        >
          <img
            v-if="viewpoint.snapshot.snapshot_data"
            :src="viewpoint.snapshot.snapshot_data"
          />
          <BIMDataIcon
            v-if="viewpoint.icon"
            class="icon"
            :name="viewpoint.icon"
            size="xl"
          />
        </div>
      </BIMDataCarousel>
    </template>
    <template v-else>
      <BcfTopicDefaultImage class="default-image" />
    </template>
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/dist/colors.js";
import { computed } from "vue";
import { getStatusColor, getViewpointConfig } from "../../../utils/topic.js";
// Components
import BIMDataCarousel from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataCarousel.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BcfTopicDefaultImage from "../../bcf-topic-card/BcfTopicDefaultImage.vue";

export default {
  components: {
    BcfTopicDefaultImage,
    BIMDataCarousel,
    BIMDataIcon,
  },
  props: {
    detailedExtensions: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const viewpoints = computed(() =>
      props.bcfTopic.viewpoints
        .filter(viewpoint => viewpoint.snapshot)
        .map(viewpoint => ({
          ...viewpoint,
          icon: getViewpointConfig(viewpoint)?.icon
        }))
    );

    const statusColor = computed(() =>
      getStatusColor(props.bcfTopic, props.detailedExtensions)
    );

    return {
      // References
      statusColor,
      viewpoints,
      // Methods
      adjustTextColor,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicViewpoints.scss"></style>
