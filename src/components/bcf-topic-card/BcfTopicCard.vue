<template>
  <div
    class="bcf-topic-card"
    :class="{ selected }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="bcf-topic-card__header">
      <div class="bcf-topic-card__header__infos flex p-r-12">
        <div
          class="bcf-topic-card__header__infos__index flex items-center justify-center"
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustTextColor(`#${priorityColor}`, '#FFF', 'var(--color-text)'),
          }"
        >
          {{ topic.index }}
        </div>
        <div class="bcf-topic-card__header__infos__title flex items-center m-l-12">
          <BIMDataTextbox maxWidth="100% - 48px" :text="topic.title" />
        </div>
        <div class="bcf-topic-card__header__infos__checkbox flex items-center m-l-12">
          <BIMDataCheckbox
            v-if="selectable && hover"
            :modelValue="selected"
            @update:modelValue="$emit('update:selected',  $event)"
          />
        </div>
      </div>
      <div class="bcf-topic-card__header__img flex items-center justify-center">
        <div
          v-if="topic.topic_status"
          class="bcf-topic-card__header__img__status flex p-6"
          :style="{
            'background-color': `#${statusColor}`,
            color: adjustTextColor(`#${statusColor}`, '#FFF', 'var(--color-text)'),
          }"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ topic.topic_status }}</span>
        </div>

        <div class="bcf-topic-card__header__img__date p-6">
          {{ $d(topic.creation_date, "short") }}
        </div>

        <img
          v-if="viewpoints.length > 0"
          :src="viewpoints[0].snapshot.snapshot_data"
          alt="topic viewpoint"
          loading="lazy"
        />
        <BcfTopicDefaultImage v-else class="default-img" />
      </div>
    </div>
    <div class="bcf-topic-card__content p-12">
      <div class="bcf-topic-card__content__priority">
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
          <BIMDataIcon name="model3d" fill color="default" size="xs" margin="0 6px 0 0" />
          <span v-if="topicObjects.length > 0" class="m-r-6">
            {{ topicObjects.length }}
          </span>
          <span>
            {{
              topicObjects.length > 0
                ? $t("BcfComponents.BcfTopicCard.elements")
                : $t("BcfComponents.BcfTopicCard.noElements")
            }}
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
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
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

    const viewpoints = computed(() => {
      return props.topic.viewpoints.filter(v => Boolean(v.snapshot));
    });

    const topicObjects = computed(() => {
      const components = props.topic.viewpoints?.[0]?.components;
      return components?.selection || [];
    });

    return {
      // References
      hover,
      priorityColor,
      statusColor,
      topicObjects,
      viewpoints,
      // Methods
      adjustTextColor,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicCard.scss"></style>
