<template>
  <div class="bcf-topic-overview">
    <div class="bcf-topic-overview__header">
      <div class="bcf-topic-overview__header__title">
        <BIMDataTextbox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div class="bcf-topic-overview__header__actions">
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="$emit('edit-bcf-topic', bcfTopic)"
        >
          <BIMDataIcon name="edit" size="xxs" fill color="default" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="showDeleteModal = true"
        >
          <BIMDataIcon name="delete" size="xxs" fill color="default" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="$emit('close')"
        >
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </div>
    </div>

    <div class="bcf-topic-overview__content">
      <div class="bcf-topic-overview__content__head">
        <div
          class="bcf-topic-overview__content__head__index"
          :style="{
            backgroundColor: `#${priorityColor}`,
            color: adjustColor(`#${priorityColor}`, '#ffffff', '#2f374a')
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic-overview__content__head__date">
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>

      <div
        class="bcf-topic-overview__content__image"
        :class="{
          'flex items-center justify-center': viewpointsWithSnapshot.length === 0
        }"
      >
        <div
          v-if="bcfTopic.topicStatus"
          class="status-badge"
          :style="{
            backgroundColor: `#${statusColor}`,
            color: adjustColor(`#${statusColor}`, '#ffffff', '#2f374a')
          }"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span>{{ bcfTopic.topicStatus }}</span>
        </div>
        <template v-if="viewpointsWithSnapshot.length > 0">
          <BIMDataCarousel :sliderPadding="0">
            <div
              class="snapshot-preview"
              v-for="viewpoint in viewpointsWithSnapshot"
              :key="viewpoint.guid"
            >
              <img
                v-if="viewpoint.snapshot.snapshotData"
                :src="viewpoint.snapshot.snapshotData"
              />
            </div>
          </BIMDataCarousel>
        </template>
        <template v-else>
          <BcfTopicDefaultImage class="default-image" />
        </template>
      </div>

      <BIMDataButton
        width="100%" 
        color="primary"
        fill
        radius
        @click="$emit('view-bcf-topic', bcfTopic)"
      >
        {{ $t("BcfComponents.BcfTopicOverview.openViewer") }}
      </BIMDataButton>

      <div class="bcf-topic-overview__content__card">
        <div class="title">
          <BIMDataIcon
            name="model3d"
            size="xs"
            fill
            color="default"
          />
          <span v-if="topicElements.length > 0">
            {{ topicElements.length }}
          </span>
          <span>
            {{
              topicElements.length
                ? $t("BcfComponents.BcfTopicOverview.elements")
                : $t("BcfComponents.BcfTopicOverview.noElements")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.type") }}
          </span>
          <span class="value">
            {{
              bcfTopic.topicType
                ? bcfTopic.topicType
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
              bcfTopic.assignedTo
                ? bcfTopic.assignedTo
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
              bcfTopic.dueDate
                ? $d(bcfTopic.dueDate, "short")
                : $t("BcfComponents.BcfTopicOverview.noDueDate")
            }}
          </span>
        </div>
      </div>

      <div class="bcf-topic-overview__content__card">
        <div class="title">
          <BIMDataIcon name="bcf" fill color="default" />
          <span>
            {{ $t("BcfComponents.BcfTopicOverview.informations") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.status") }}
          </span>
          <span class="value">
            {{ bcfTopic.topicStatus || $t("BcfComponents.BcfTopicOverview.noStatusSpecified") }}
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
          <span class=" label">
            {{ $t("BcfComponents.BcfTopicOverview.priority") }}
          </span>
          <span class=" value">
            {{ bcfTopic.priority || $t("BcfComponents.BcfTopicOverview.priorityNotDefined") }}
          </span>
        </div>
        <div class="line">
          <span class=" label">
            Auteur :
          </span>
          <span class="value">
            {{ bcfTopic.creationAuthor }}
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
import { computed, ref } from "@vue/composition-api";
import { useService } from "../../service.js";
import { DEFAULT_PRIORITY_COLOR, DEFAULT_STATUS_COLOR } from "../../config.js";
import { adjustColor } from "../../utils/colors.js";
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
  },
  emits: [
    "edit-bcf-topic",
    "view-bcf-topic",
    "bcf-topic-deleted",
    "comment-created",
    "comment-updated",
    "comment-deleted",
    "close",
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
      topicElements,
      topicLabels,
      viewpointsWithSnapshot,
      // Methods
      adjustColor,
      removeTopic,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicOverview.scss"></style>
