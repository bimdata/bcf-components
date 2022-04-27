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
          <BIMDataIcon name="edit" fill color="default" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="showDeleteModal = true"
        >
          <BIMDataIcon name="delete" fill color="default" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="$emit('close')"
        >
          <BIMDataIcon name="close" fill color="granite-light" size="xxs" />
        </BIMDataButton>
      </div>
    </div>

    <div class="bcf-topic-overview__content">
      <div
        class="bcf-topic-overview__content__subheader"
      >
        <div
          class="bcf-topic-overview__content__subheader__index"
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustColor(`#${priorityColor}`, '#ffffff', '#2f374a')
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="bcf-topic-overview__content__subheader__date"
        >
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
            'background-color': `#${statusColor}`,
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
        {{ $t("OpenTopicIssue.openViewer") }}
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
                ? $t("OpenTopicIssue.elements")
                : $t("OpenTopicIssue.noElements")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.type") }}
          </span>
          <span class="value">
            {{
              bcfTopic.topicType
                ? bcfTopic.topicType
                : $t("OpenTopicIssue.noTypeSpecified")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.description") }}
          </span>
          <span class="value">
            {{
              bcfTopic.description
                ? bcfTopic.description
                : $t("OpenTopicIssue.noDescriptionProvided")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.assignedTo") }}
          </span>
          <span class="value">
            {{
              bcfTopic.assignedTo
                ? bcfTopic.assignedTo
                : $t("OpenTopicIssue.notAssigned")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.dueDate") }}
          </span>
          <span class="value">
            {{
              bcfTopic.dueDate
                ? $d(bcfTopic.dueDate, "short")
                : $t("OpenTopicIssue.noDueDate")
            }}
          </span>
        </div>
      </div>

      <div class="bcf-topic-overview__content__card">
        <div class="title">
          <BIMDataIcon name="bcf" fill color="default" />
          <span>
            {{ $t("OpenTopicIssue.informations") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.status") }}
          </span>
          <span class="value">
            {{ bcfTopic.topicStatus || $t("OpenTopicIssue.noStatusSpecified") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("OpenTopicIssue.stage") }}
          </span>
          <span class="value">
            {{ bcfTopic.stage || $t("OpenTopicIssue.noStageProvided") }}
          </span>
        </div>
        <div class="line">
          <span class=" label">
            {{ $t("OpenTopicIssue.priority") }}
          </span>
          <span class=" value">
            {{ bcfTopic.priority || $t("OpenTopicIssue.priorityNotDefined") }}
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
            {{ $t("OpenTopicIssue.tags") }}
          </span>
          <span class="value">
            {{
              topicTags.length
                ? topicTags.join(", ")
                : $t("OpenTopicIssue.noTags")
            }}
          </span>
        </div>
      </div>

      <BcfTopicComments
        :project="project"
        :users="users"
        :bcfTopic="bcfTopic"
      />
    </div>

    <BIMDataSafeZoneModal v-if="showDeleteModal" class="delete-modal">
      <template #text>
        {{ $t("ModalDeleteTopic.deleteText", { name: bcfTopic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton
          class="m-r-12"
          color="high"
          fill
          radius
          @click="removeTopic"
        >
          {{ $t("ModalDeleteTopic.deleteBcfButton") }}
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="showDeleteModal = false"
        >
          {{ $t("ModalDeleteTopic.keepBcfButton") }}
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
import { useBcf } from "../../composables/bcf.js";
import { DEFAULT_PRIORITY_COLOR, DEFAULT_STATUS_COLOR, MODEL_TYPE, MODEL_STATUS } from "../../config";
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
    models: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
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
    isCarousel: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", "delete-bcf-topic", "edit-bcf-topic", "view-bcf-topic"],
  setup(props) {
    // TODO: could be provided by parent ?
    const { deleteTopic } = useBcf();

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

    const topicTags = computed(() => {
      if (props.bcfTopic.labels?.length) {
        return Array.from(props.bcfTopic.labels).sort();
      } else {
        return [];
      }
    });

    const modelIDs = computed(() => {
      let ids = [];
      if (props.bcfTopic.ifcs?.length) {
        ids = props.bcfTopic.ifcs;
      } else {
        const ifcs = props.models
          .filter(model => model.type === MODEL_TYPE.IFC)
          .filter(model => model.status === MODEL_STATUS.COMPLETED)
          .sort((a, b) =>
            a.createdAt.getTime() > b.createdAt.getTime() ? 1 : -1
          );
        if (ifcs.length > 0) {
          ids.push(ifcs[0].id);
        }
      }
      return ids;
    });

    const removeTopic = async () => {
      try {
        loading.value = true;
        await deleteTopic(props.project, props.bcfTopic);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      modelIDs,
      priorityColor,
      showDeleteModal,
      statusColor,
      topicElements,
      topicTags,
      viewpointsWithSnapshot,
      // Methods
      adjustColor,
      removeTopic,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicOverview.scss"></style>
