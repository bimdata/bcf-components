<template>
  <div class="bcf-topic-overview">
    <div class="bcf-topic-overview__header">
      <template v-if="uiConfig.backButton">
        <BIMDataButton
          ripple
          rounded
          icon
          @click="$emit('back')"
        >
          <BIMDataIcon name="arrow" size="xxs" />
        </BIMDataButton>
      </template>
      <div class="bcf-topic-overview__header__title">
        <BIMDataTextbox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div class="bcf-topic-overview__header__actions">
        <BIMDataButton
          ripple
          rounded
          icon
          @click="$emit('edit-bcf-topic', bcfTopic)"
        >
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          ripple
          rounded
          icon
          @click="showDeleteModal = true"
        >
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
        <template v-if="uiConfig.closeButton">
          <BIMDataButton
            ripple
            rounded
            icon
            @click="$emit('close')"
          >
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </template>
      </div>
    </div>

    <div class="bcf-topic-overview__content">
      <div class="bcf-topic-overview__content__head">
        <div
          class="bcf-topic-overview__content__head__index"
          :style="{
            backgroundColor: `#${priorityColor}`,
            color: adjustTextColor(`#${priorityColor}`, '#ffffff', '#2f374a')
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic-overview__content__head__date">
          {{ $d(bcfTopic.creation_date, "short") }}
        </div>
      </div>

      <div
        class="bcf-topic-overview__content__image"
        :class="{
          'flex items-center justify-center': viewpointsWithSnapshot.length === 0
        }"
      >
        <div
          v-if="bcfTopic.topic_status"
          class="status-badge"
          :style="{
            backgroundColor: `#${statusColor}`,
            color: adjustTextColor(`#${statusColor}`, '#ffffff', '#2f374a')
          }"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span>{{ bcfTopic.topic_status }}</span>
        </div>
        <template v-if="viewpointsWithSnapshot.length > 0">
          <BIMDataCarousel :sliderPadding="0">
            <div
              class="snapshot-preview"
              v-for="viewpoint in viewpointsWithSnapshot"
              :key="viewpoint.guid"
            >
              <img
                v-if="viewpoint.snapshot.snapshot_data"
                :src="viewpoint.snapshot.snapshot_data"
              />
            </div>
          </BIMDataCarousel>
        </template>
        <template v-else>
          <BcfTopicDefaultImage class="default-image" />
        </template>
      </div>

      <BIMDataButton
        v-if="viewerMode"
        width="100%" 
        fill
        radius
        :disabled="topicComponents.length === 0"
        @click="$emit('view-components', bcfTopic)"
      >
        <BIMDataIcon name="model3d" size="xs" margin="0 6px 0 0" />
        <template v-if="topicComponents.length > 0">
          {{ $t("BcfComponents.BcfTopicOverview.elements", { count: topicComponents.length }) }}
        </template>
        <template v-else>
          {{ $t("BcfComponents.BcfTopicOverview.noElements") }}
        </template>
      </BIMDataButton>

      <BIMDataButton
        v-else
        width="100%" 
        color="primary"
        fill
        radius
        @click="$emit('view-bcf-topic', bcfTopic)"
      >
        {{ $t("BcfComponents.BcfTopicOverview.openViewer") }}
      </BIMDataButton>

      <div class="bcf-topic-overview__content__card">
        <div class="title" v-if="!viewerMode">
          <BIMDataIcon name="model3d" size="xs" />
          <span>
            {{ $t("BcfComponents.BcfTopicOverview.elements", { count: topicComponents.length }) }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.type") }}
          </span>
          <span class="value">
            {{
              bcfTopic.topic_type
                ? bcfTopic.topic_type
                : $t("BcfComponents.BcfTopicOverview.noTypeSpecified")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.description") }}
          </span>
          <span class="value">
            {{
              bcfTopic.description
                ? bcfTopic.description
                : $t("BcfComponents.BcfTopicOverview.noDescriptionProvided")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.assignedTo") }}
          </span>
          <span class="value">
            {{
              bcfTopic.assigned_to
                ? bcfTopic.assigned_to
                : $t("BcfComponents.BcfTopicOverview.notAssigned")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.dueDate") }}
          </span>
          <span class="value">
            {{
              bcfTopic.due_date
                ? $d(bcfTopic.due_date, "short")
                : $t("BcfComponents.BcfTopicOverview.noDueDate")
            }}
          </span>
        </div>
      </div>

      <div class="bcf-topic-overview__content__card">
        <div class="title">
          <BIMDataIcon name="bcf" />
          <span>
            {{ $t("BcfComponents.BcfTopicOverview.informations") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.status") }}
          </span>
          <span class="value">
            {{ bcfTopic.topic_status || $t("BcfComponents.BcfTopicOverview.noStatusSpecified") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.stage") }}
          </span>
          <span class="value">
            {{ bcfTopic.stage || $t("BcfComponents.BcfTopicOverview.noStageProvided") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.priority") }}
          </span>
          <span class="value" :style="{ color: `#${priorityColor}` }">
            {{ bcfTopic.priority || $t("BcfComponents.BcfTopicOverview.priorityNotDefined") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            Auteur :
          </span>
          <span class="value">
            {{ bcfTopic.creation_author }}
          </span>
        </div>
        <div class="line m-t-12">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.tags") }}
          </span>
          <span class="value">
            {{
              topicLabels.length
                ? topicLabels.join(", ")
                : $t("BcfComponents.BcfTopicOverview.noTags")
            }}
          </span>
        </div>
      </div>

      <BcfTopicComments
        :project="project"
        :bcfTopic="bcfTopic"
        @comment-created="$emit('comment-created', $event)"
        @comment-updated="$emit('comment-updated', $event)"
        @comment-deleted="$emit('comment-deleted', $event)"
      />
    </div>

    <BIMDataSafeZoneModal v-if="showDeleteModal" class="delete-modal">
      <template #text>
        {{ $t("BcfComponents.BcfTopicOverview.deleteText", { name: bcfTopic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton
          class="m-r-12"
          color="high"
          fill
          radius
          @click="removeTopic"
        >
          {{ $t("BcfComponents.BcfTopicOverview.deleteBcfButton") }}
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="showDeleteModal = false"
        >
          {{ $t("BcfComponents.BcfTopicOverview.keepBcfButton") }}
        </BIMDataButton>
      </template>
    </BIMDataSafeZoneModal>

    <div v-if="loading">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { adjustTextColor } from "@bimdata/design-system/dist/colors.js";
import { computed, ref } from "vue";
import { useService } from "../../service.js";
import { getPriorityColor, getStatusColor } from "../../utils/topic.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataCarousel from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataCarousel.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataSafeZoneModal from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSafeZoneModal.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicComments from "./bcf-topic-comments/BcfTopicComments.vue";
import BcfTopicDefaultImage from "../bcf-topic-card/BcfTopicDefaultImage.vue";

export default {
  components: {
    BcfTopicComments,
    BcfTopicDefaultImage,
    BIMDataButton,
    BIMDataCarousel,
    BIMDataIcon,
    BIMDataLoading,
    BIMDataSafeZoneModal,
    BIMDataTextbox,
  },
  props: {
    viewerMode: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    },
    uiConfig: {
      type: Object,
      default: () => ({ backButton: false, closeButton: false })
    }
  },
  emits: [
    "back",
    "bcf-topic-deleted",
    "close",
    "comment-created",
    "comment-deleted",
    "comment-updated",
    "edit-bcf-topic",
    "view-bcf-topic",
    "view-components",
  ],
  setup(props, { emit }) {
    const { deleteTopic } = useService();

    const loading = ref(false);
    const showDeleteModal = ref(false);

    const viewpointsWithSnapshot = computed(() => {
      return props.bcfTopic.viewpoints.filter(viewpoint =>
        Boolean(viewpoint.snapshot)
      );
    });

    const priorityColor = computed(() => getPriorityColor(props.bcfTopic, props.detailedExtensions))
    const statusColor = computed(() => getStatusColor(props.bcfTopic, props.detailedExtensions))

    const topicComponents = computed(() => {
      const components = props.bcfTopic.viewpoints?.[0]?.components;
      return components?.selection || [];
    });

    const topicLabels = computed(() => {
      if (props.bcfTopic.labels?.length) {
        return Array.from(props.bcfTopic.labels).sort();
      } else {
        return [];
      }
    });

    const removeTopic = async () => {
      try {
        showDeleteModal.value = false;
        loading.value = true;
        await deleteTopic(props.project, props.bcfTopic);
        emit("bcf-topic-deleted", props.bcfTopic);
        emit("close");
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      loading,
      priorityColor,
      showDeleteModal,
      statusColor,
      topicComponents,
      topicLabels,
      viewpointsWithSnapshot,
      // Methods
      adjustTextColor,
      removeTopic,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicOverview.scss"></style>
