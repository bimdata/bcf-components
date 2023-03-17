<template>
  <div
    class="bcf-topic-card"
    :class="{ selected }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="bcf-topic-card__header">
      <div
        class="index"
        :style="{
          'background-color': `#${priorityColor}`,
          color: adjustTextColor(`#${priorityColor}`, '#FFF', 'var(--color-text)'),
        }"
      >
        {{ topic.index }}
      </div>
      <div class="title">
        <BIMDataTextbox maxWidth="100% - 48px" :text="topic.title" />
      </div>
      <div class="checkbox">
        <BIMDataCheckbox
          v-show="selectable && hover"
          :modelValue="selected"
          @update:modelValue="$emit('update:selected',  $event)"
        />
      </div>
    </div>

    <div class="bcf-topic-card__image">
      <div
        v-if="topic.topic_status"
        class="status"
        :style="{
          'background-color': `#${statusColor}`,
          color: adjustTextColor(`#${statusColor}`, '#FFF', 'var(--color-text)'),
        }"
      >
        <BIMDataIcon name="information" fill color="default" />
        <span class="m-l-6">{{ topic.topic_status }}</span>
      </div>

      <div class="date">
        {{ $d(topic.creation_date, "short") }}
      </div>

      <img
        v-if="topicImage"
        :src="topicImage"
        alt="topic viewpoint"
        loading="lazy"
      />
      <BcfTopicDefaultImage
        v-else 
        class="img-default"
      />
    </div>

    <div class="bcf-topic-card__content">
      <div>
        <strong>
          {{ $t("BcfComponents.BcfTopicCard.priority") }}
        </strong>
        <span :style="{ color: `#${priorityColor}` }">
          {{ topic.priority || $t("BcfComponents.BcfTopicCard.noPriority") }}
        </span>
      </div>
      <div>
        <strong>
          {{ $t("BcfComponents.BcfTopicCard.assignedTo") }}
        </strong>
        <span>
          {{ topic.assigned_to || $t("BcfComponents.BcfTopicCard.notSpecified") }}
        </span>
      </div>
      <div class="flex justify-around m-t-12">
        <div class="flex items-center">
          <BIMDataIcon name="model3d" fill color="default" size="xs"/>
          <span class="m-l-6">
            {{ $t("BcfComponents.BcfTopicCard.elements", { n: topicObjects.length }) }}
          </span>
        </div>
        <BIMDataButton width="48%" color="primary" fill radius @click="$emit('open-topic', topic)">
          {{ $t("BcfComponents.BcfTopicCard.see") }}
        </BIMDataButton>
      </div>
    </div>
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/dist/colors.js";
import { computed, ref } from "vue";
import { getPriorityColor, getStatusColor } from "../../utils/topic.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTextbox.js";
import BcfTopicDefaultImage from "./BcfTopicDefaultImage.vue";

export default {
  components: {
    BcfTopicDefaultImage,
    BIMDataButton,
    BIMDataIcon,
    BIMDataTextbox,
  },
  props: {
    detailedExtensions: {
      type: Object,
      required: true,
    },
    topic: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["open-topic", "update:selected"],
  setup(props) {
    const hover = ref(false);

    const priorityColor = computed(() => getPriorityColor(props.topic, props.detailedExtensions));

    const statusColor = computed(() => getStatusColor(props.topic, props.detailedExtensions));

    const topicImage = computed(() => props.topic.viewpoints?.filter(v => v.snapshot)[0]?.snapshot.snapshot_data);

    const topicObjects = computed(() => props.topic.viewpoints?.[0]?.components?.selection ?? []);

    return {
      // References
      hover,
      priorityColor,
      statusColor,
      topicImage,
      topicObjects,
      // Methods
      adjustTextColor,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicCard.scss"></style>
