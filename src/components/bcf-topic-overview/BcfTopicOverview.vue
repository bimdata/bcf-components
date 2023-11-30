<template>
  <div class="bcf-topic-overview">
    <div class="bcf-topic-overview__header">
      <BIMDataButton
        v-if="uiConfig.backButton"
        ghost rounded icon
        @click="$emit('back')"
      >
        <BIMDataIconArrow size="xxs" fill color="granite-light" />
      </BIMDataButton>
      <div class="bcf-topic-overview__header__title">
        <BIMDataTextbox maxWidth="250px" :text="topic.title" />
      </div>
      <div class="bcf-topic-overview__header__actions">
        <BIMDataButton
          v-if="uiConfig.editButton"
          ghost rounded icon
          @click="$emit('edit-topic', topic)"
        >
          <BIMDataIconEdit size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          v-if="uiConfig.deleteButton"
          ghost rounded icon
          @click="showDeleteModal = true"
        >
          <BIMDataIconDelete size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          v-if="uiConfig.closeButton"
          ghost rounded icon
          @click="$emit('close')"
        >
          <BIMDataIconClose size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </div>
    </div>

    <div class="bcf-topic-overview__content">
      <div class="bcf-topic-overview__content__head">
        <div
          class="bcf-topic-overview__content__head__index"
          :style="{
            backgroundColor: `#${priorityColor}`,
            color: adjustTextColor(`#${priorityColor}`, '#FFF', '#2F374A'),
          }"
        >
          {{ topic.index }}
        </div>
        <div class="bcf-topic-overview__content__head__date">
          {{ $d(topic.creation_date, "short") }}
        </div>
      </div>

      <BcfTopicViewpoints
        :detailedExtensions="detailedExtensions"
        :topic="topic"
        @view-topic-viewpoint="$emit('view-topic-viewpoint', $event)"
      />

      <BIMDataButton
        v-if="uiConfig.viewerMode"
        width="100%"
        fill
        radius
        :disabled="topicObjects.length === 0"
        @click="$emit('view-topic-components', topic)"
      >
        <BIMDataIconModel3D size="xs" margin="0 6px 0 0" />
        <template v-if="topicObjects.length > 0">
          {{ $t("BcfComponents.BcfTopicOverview.elements", { count: topicObjects.length }) }}
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
        @click="$emit('view-topic', topic)"
      >
        {{ $t("BcfComponents.BcfTopicOverview.openViewer") }}
      </BIMDataButton>

      <div class="bcf-topic-overview__content__card">
        <div class="title" v-if="!uiConfig.viewerMode">
          <BIMDataIconModel3D size="xs" />
          <span>
            {{ $t("BcfComponents.BcfTopicOverview.elements", { count: topicObjects.length }) }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.type") }}
          </span>
          <span class="value">
            {{
              topic.topic_type
                ? topic.topic_type
                : $t("BcfComponents.BcfTopicOverview.noTypeSpecified")
            }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.description") }}
          </span>
          <span class="value" style="white-space: pre-line">
            {{
              topic.description
                ? topic.description
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
              topic.assigned_to
                ? topic.assigned_to
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
              topic.due_date
                ? $d(topic.due_date, "short")
                : $t("BcfComponents.BcfTopicOverview.noDueDate")
            }}
          </span>
        </div>
      </div>

      <div class="bcf-topic-overview__content__card">
        <div class="title">
          <BIMDataIconBcf />
          <span>
            {{ $t("BcfComponents.BcfTopicOverview.informations") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.status") }}
          </span>
          <span class="value">
            {{ topic.topic_status || $t("BcfComponents.BcfTopicOverview.noStatusSpecified") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.stage") }}
          </span>
          <span class="value">
            {{ topic.stage || $t("BcfComponents.BcfTopicOverview.noStageProvided") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.priority") }}
          </span>
          <span class="value" :style="{ color: `#${priorityColor}` }">
            {{ topic.priority || $t("BcfComponents.BcfTopicOverview.priorityNotDefined") }}
          </span>
        </div>
        <div class="line">
          <span class="label">
            {{ $t("BcfComponents.BcfTopicOverview.author") }}
          </span>
          <span class="value">
            {{ topic.creation_author }}
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
        :uiConfig="uiConfig"
        :project="project"
        :topic="topic"
        :currentUserEmail="currentUserEmail"
        @comment-created="$emit('comment-created', $event)"
        @comment-updated="$emit('comment-updated', $event)"
        @comment-deleted="$emit('comment-deleted', $event)"
        @view-comment-snapshot="$emit('view-comment-snapshot',$event)"
      />
    </div>

    <BIMDataSafeZoneModal v-if="showDeleteModal" class="delete-modal">
      <template #text>
        {{ $t("BcfComponents.BcfTopicOverview.deleteText", { name: topic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton class="m-r-12" color="high" fill radius @click="deleteTopic">
          {{ $t("BcfComponents.BcfTopicOverview.deleteBcfButton") }}
        </BIMDataButton>
        <BIMDataButton color="primary" outline radius @click="showDeleteModal = false">
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
import { adjustTextColor } from "@bimdata/design-system/src/BIMDataComponents/BIMDataColorSelector/colors.js";
import { computed, onMounted, ref } from "vue";
import service from "../../service.js";
import { getPriorityColor } from "../../utils/topic.js";
// Components
import BcfTopicComments from "./bcf-topic-comments/BcfTopicComments.vue";
import BcfTopicDefaultImage from "../bcf-topic-card/BcfTopicDefaultImage.vue";
import BcfTopicViewpoints from "./bcf-topic-viewpoints/BcfTopicViewpoints.vue";

export default {
  components: {
    BcfTopicComments,
    BcfTopicDefaultImage,
    BcfTopicViewpoints,
  },
  props: {
    uiConfig: {
      type: Object,
      default: () => ({
        viewerMode: false,
        backButton: false,
        closeButton: false,
        editButton: false,
        deleteButton: false,
        commentCreation: false,
      }),
    },
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
    currentUserEmail: {
      type: String,
      required: false,
    },
  },
  emits: [
    "back",
    "close",
    "comment-created",
    "comment-deleted",
    "comment-updated",
    "edit-topic",
    "topic-deleted",
    "topic-delete-error",
    "view-comment-snapshot",
    "view-topic",
    "view-topic-components",
    "view-topic-viewpoint",
  ],
  setup(props, { emit }) {
    const loading = ref(false);
    const showDeleteModal = ref(false);

    const priorityColor = computed(() => getPriorityColor(props.topic, props.detailedExtensions));

    const topicObjects = computed(() => props.topic.viewpoints?.[0]?.components?.selection ?? []);

    const topicLabels = computed(() => Array.from(props.topic.labels ?? []).sort());

    const deleteTopic = async () => {
      try {
        showDeleteModal.value = false;
        loading.value = true;
        await service.deleteTopic(props.project, props.topic);
        emit("topic-deleted", props.topic);
      } catch (error) {
        console.error(error);
        emit("topic-delete-error", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      loading,
      priorityColor,
      showDeleteModal,
      topicLabels,
      topicObjects,
      // Methods
      adjustTextColor,
      deleteTopic,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicOverview.scss"></style>
