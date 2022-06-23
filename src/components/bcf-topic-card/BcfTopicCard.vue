<template>
  <div class="bcf-topic-card">
    <div class="bcf-topic-card__header">
      <div class="bcf-topic-card__header__infos flex">
        <div
          class="bcf-topic-card__header__infos__index flex items-center justify-center"
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustTextColor(`#${priorityColor}`, '#ffffff', 'var(--color-text)')
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic-card__header__infos__title flex items-center m-l-12">
          <BIMDataTextbox maxWidth="100% - 48px" :text="bcfTopic.title" />
        </div>
      </div>
      <div class="bcf-topic-card__header__img flex items-center justify-center">
        <div
          v-if="bcfTopic.topicStatus"
          class="bcf-topic-card__header__img__status flex p-6"
          :style="{
            'background-color': `#${statusColor}`,
            color: adjustTextColor(`#${statusColor}`, '#ffffff', 'var(--color-text)')
          }"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>

        <div class="bcf-topic-card__header__img__date p-6">
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>

        <img
          v-if="viewpointsWithSnapshot.length > 0"
          :src="viewpointsWithSnapshot[0].snapshot.snapshotData"
          alt="ViewPoint"
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
          {{ bcfTopic.priority || $t("BcfComponents.BcfTopicCard.noPriority") }}
        </span>
      </div>
      <div>
        <strong>
          {{ $t("BcfComponents.BcfTopicCard.assignedTo") }}
        </strong>
        <span>
          {{ bcfTopic.assignedTo || $t("BcfComponents.BcfTopicCard.notSpecified") }}
        </span>
      </div>
      <div class="flex justify-around m-t-12">
        <div class="flex items-center">
          <BIMDataIcon
            name="model3d"
            fill
            color="default"
            size="xs"
            margin="0 6px 0 0"
          />
          <span v-if="topicElements.length > 0" class="m-r-6">
            {{ topicElements.length }}
          </span>
          <span>
            {{
              topicElements.length
                ? $t("BcfComponents.BcfTopicCard.elements")
                : $t("BcfComponents.BcfTopicCard.noElements")
            }}
          </span>
        </div>
        <BIMDataButton
          width="48%"
          color="primary"
          fill
          radius
          @click="$emit('open-bcf-topic', bcfTopic)"
        >
          {{ $t("BcfComponents.BcfTopicCard.see") }}
        </BIMDataButton>
      </div>
    </div>
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/dist/colors.js";
import { computed } from "@vue/composition-api";
import { DEFAULT_PRIORITY_COLOR, DEFAULT_STATUS_COLOR } from "../../config.js";
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
    bcfTopic: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    }
  },
  emits: [
    "open-bcf-topic"
  ],
  setup(props, { emit }) {
    const viewpointsWithSnapshot = computed(() => {
      return props.bcfTopic.viewpoints.filter(viewpoint =>
        Boolean(viewpoint.snapshot)
      );
    });

    const priorityColor = computed(() => {
      if (props.bcfTopic.priority) {
        const priorityDetail = props.detailedExtensions.priorities.find(
          p => p.priority === props.bcfTopic.priority
        );
        if (priorityDetail && priorityDetail.color) {
          return priorityDetail.color;
        }
      }
      return DEFAULT_PRIORITY_COLOR;
    });

    const statusColor = computed(() => {
      if (props.bcfTopic.topicStatus) {
        const statusDetail = props.detailedExtensions.topicStatuses.find(
          s => s.topicStatus === props.bcfTopic.topicStatus
        );
        if (statusDetail && statusDetail.color) {
          return statusDetail.color;
        }
      }
      return DEFAULT_STATUS_COLOR;
    });

    const topicElements = computed(() => {
      if (
        props.bcfTopic.components &&
        props.bcfTopic.components.length > 0 &&
        props.bcfTopic.components[0]?.selection
      ) {
        return props.bcfTopic.components[0].selection;
      } else {
        return [];
      }
    });

    return {
      // References
      priorityColor,
      statusColor,
      topicElements,
      viewpointsWithSnapshot,
      // Methods
      adjustTextColor
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicCard.scss"></style>
