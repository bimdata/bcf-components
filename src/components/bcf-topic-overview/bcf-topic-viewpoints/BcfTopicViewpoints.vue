<template>
  <div class="bcf-topic-viewpoints" :class="{ empty: viewpoints.length === 0 }">
    <div
      v-if="topic.topic_status"
      class="status-badge"
      :style="{
        backgroundColor: `#${statusColor}`,
        color: adjustTextColor(`#${statusColor}`, '#FFF', '#2F374A'),
      }"
    >
      <BIMDataIconInformation fill color="default" />
      <span>{{ topic.topic_status }}</span>
    </div>
    <template v-if="viewpoints.length > 0">
      <BIMDataCarousel :sliderPadding="0">
        <div class="snapshot-preview" v-for="viewpoint in viewpoints" :key="viewpoint.guid">
          <div class="warning" v-if="warning">
            <BIMDataIconWarning fill color="warning" size="xxs"/>
          </div>
          <img
            v-if="viewpoint.snapshot.snapshot_data"
            :src="viewpoint.snapshot.snapshot_data"
            @click="$emit('view-topic-viewpoint', viewpoint)"
          />
          <BIMDataIcon v-if="viewpoint.icon" class="icon" :name="viewpoint.icon" size="xl" />
        </div>
      </BIMDataCarousel>
    </template>
    <template v-else>
      <BcfTopicDefaultImage class="default-image" />
    </template>
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/src/BIMDataComponents/BIMDataColorSelector/colors.js";
import { computed, watch } from "vue";
import service from "../../../service.js";
import { getStatusColor } from "../../../utils/topic.js";
import { getViewpointConfig } from "../../../utils/viewpoints.js";
// Components
import BcfTopicDefaultImage from "../../bcf-topic-card/BcfTopicDefaultImage.vue";

export default {
  components: {
    BcfTopicDefaultImage,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    detailedExtensions: {
      type: Object,
      required: true,
    },
    topic: {
      type: Object,
      required: true,
    },
    warning: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["view-topic-viewpoint"],
  setup(props) {
    const viewpoints = computed(() =>
      (props.topic.viewpoints ?? [])
        .filter(v => v.snapshot)
        .map(viewpoint => ({
          ...viewpoint,
          icon: getViewpointConfig(viewpoint)?.icon,
        }))
    );

    const statusColor = computed(() => getStatusColor(props.topic, props.detailedExtensions));

    watch(
      () => props.topic,
      async () => {
        if (!props.topic.viewpoints) {
          // Load topic viewpoints if they are not loaded yet
          props.topic.viewpoints = await service.fetchTopicViewpoints(props.project, props.topic);
        }
      },
      { immediate: true }
    );

    return {
      // References
      statusColor,
      viewpoints,
      // Methods
      adjustTextColor,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicViewpoints.scss"></style>
