<template>
  <div
    v-if="visible"
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
          @update:modelValue="$emit('update:selected', $event)"
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
        <BIMDataIconInformation fill color="default" />
        <span class="m-l-6">{{ topic.topic_status }}</span>
      </div>

      <div class="date">
        {{ $d(topic.creation_date, "short") }}
      </div>

      <img v-if="topicImage" :src="topicImage" alt="topic viewpoint" loading="lazy" />
      <BcfTopicDefaultImage v-else class="img-default" />
    </div>

    <div class="bcf-topic-card__content">
      <div>
        <strong>
          {{ `${$t("BcfComponents.BcfTopicCard.priority")}: ` }}
        </strong>
        <span :style="{ color: `#${priorityColor}` }">
          {{ topic.priority || $t("BcfComponents.BcfTopicCard.noPriority") }}
        </span>
      </div>
      <div>
        <strong>
          {{ `${$t("BcfComponents.BcfTopicCard.assignedTo")}: ` }}
        </strong>
        <span>
          {{ topic.assigned_to || $t("BcfComponents.BcfTopicCard.notSpecified") }}
        </span>
      </div>
      <div class="flex justify-around m-t-12">
        <div class="flex items-center">
          <BIMDataIconModel3D fill color="default" size="xs" />
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

  <div v-else ref="placeholder" class="bcf-topic-card-placeholder">
    <BIMDataSpinner v-if="loading" />
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/src/BIMDataComponents/BIMDataColorSelector/colors.js";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import service from "../../service.js";
import { getPriorityColor, getStatusColor } from "../../utils/topic.js";
// Components
import BcfTopicDefaultImage from "./BcfTopicDefaultImage.vue";

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
    const visible = ref(false);
    const loading = ref(false);
    const placeholder = ref(null);
    const hover = ref(false);

    const priorityColor = computed(() => getPriorityColor(props.topic, props.detailedExtensions));

    const statusColor = computed(() => getStatusColor(props.topic, props.detailedExtensions));

    const topicImage = computed(
      () => props.topic.viewpoints?.filter((v) => v.snapshot)[0]?.snapshot.snapshot_data
    );

    const topicObjects = computed(() => props.topic.viewpoints?.[0]?.components?.selection ?? []);

    let unwatchTopic;

    onMounted(() => {
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (!isIntersecting) return;

          unwatchTopic = watch(
            () => props.topic,
            async topic => {
              loading.value = true;
              topic.viewpoints = await service.fetchTopicViewpoints(props.project, topic);
              loading.value = false;
              visible.value = true;
            },
            { immediate: true }
          );

          observer.disconnect();
        },
        {
          rootMargin: `${placeholder.value.clientHeight}px`
        }
      );

      observer.observe(placeholder.value);
    });

    onUnmounted(() => {
      unwatchTopic?.();
    });

    return {
      // References
      hover,
      loading,
      placeholder,
      priorityColor,
      statusColor,
      topicImage,
      topicObjects,
      visible,
      // Methods
      adjustTextColor,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicCard.scss"></style>
