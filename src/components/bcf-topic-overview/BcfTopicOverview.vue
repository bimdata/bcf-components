<template>
  <div class="bcf-topic-overview">
    <div class="bcf-topic-overview__header flex items-center justify-between">
      <div
        class="bcf-topic-overview__header__title flex justify-center items-center p-x-6"
      >
        <BIMDataTextbox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div
        class="bcf-topic-overview__header__actions flex justify-center items-center"
      >
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
    <div class="bcf-topic-overview__content p-r-6 p-b-6 p-l-6">
      <div
        class="bcf-topic-overview__content__subheader flex items-center justify-between m-t-12"
      >
        <div
          class="bcf-topic-overview__content__subheader__index flex justify-center items-center p-x-6"
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustColor(`#${priorityColor}`, '#ffffff', '#2f374a')
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="bcf-topic-overview__content__subheader__date flex justify-center items-center"
        >
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>
      <div
        class="bcf-topic-overview__content__img text-center m-t-12"
        :class="{
          'flex items-center justify-center': viewpointsWithSnapshot.length === 0
        }"
      >
        <div
          v-if="bcfTopic.topicStatus"
          class="bcf-topic-overview__content__img__status flex p-6"
          :style="{
            'background-color': `#${statusColor}`,
            color: adjustColor(`#${statusColor}`, '#ffffff', '#2f374a')
          }"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
        <div class="img-previews flex" v-if="viewpointsWithSnapshot.length > 0">
        <!-- <CarouselList v-if="viewpointsWithSnapshot.length > 0" :sliderPadding="0"> -->
          <div
            class="img-preview"
            v-for="viewpoint in viewpointsWithSnapshot"
            :key="viewpoint.guid"
          >
            <img
              v-if="viewpoint.snapshot.snapshotData"
              :src="viewpoint.snapshot.snapshotData"
            />
          </div>
        <!-- </CarouselList> -->
        </div>
        <BcfTopicDefaultImage v-else class="no-img-topic" />
      </div>
      <div class="m-t-12">
        <BIMDataButton width="100%" color="primary" fill radius @click="$emit('view-bcf-topic', bcfTopic)">
          {{ $t("OpenTopicIssue.openViewer") }}
        </BIMDataButton>
      </div>
      <div class="bcf-topic-overview__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
          <BIMDataIcon
            name="model3d"
            size="xs"
            fill
            color="default"
            margin="0 6px 0 0"
          />
          <span class="m-r-6" v-if="topicElements.length > 0">
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
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.type") }}
          </span>
          <span class="color-granite">
            {{
              bcfTopic.topicType
                ? bcfTopic.topicType
                : $t("OpenTopicIssue.noTypeSpecified")
            }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.description") }}
          </span>
          <span class="color-granite">
            {{
              bcfTopic.description
                ? bcfTopic.description
                : $t("OpenTopicIssue.noDescriptionProvided")
            }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.assignedTo") }}
          </span>
          <span class="color-granite">
            {{
              bcfTopic.assignedTo
                ? bcfTopic.assignedTo
                : $t("OpenTopicIssue.notAssigned")
            }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.dueDate") }}
          </span>
          <span class="color-granite">
            {{
              bcfTopic.dueDate
                ? $d(bcfTopic.dueDate, "short")
                : $t("OpenTopicIssue.noDueDate")
            }}
          </span>
        </div>
      </div>
      <div class="bcf-topic-overview__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
          <BIMDataIcon name="bcf" fill color="default" />
          <span class="m-l-6">
            {{ $t("OpenTopicIssue.informations") }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.status") }}
          </span>
          <span class="color-granite">
            {{ bcfTopic.topicStatus || $t("OpenTopicIssue.noStatusSpecified") }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.stage") }}
          </span>
          <span class="color-granite">
            {{ bcfTopic.stage || $t("OpenTopicIssue.noStageProvided") }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.priority") }}
          </span>
          <span class="color-granite">
            {{ bcfTopic.priority || $t("OpenTopicIssue.priorityNotDefined") }}
          </span>
        </div>
        <div>
          <span class="color-primary">
            Auteur :
          </span>
          <span class="color-granite">
            {{ bcfTopic.creationAuthor }}
          </span>
        </div>
        <div class="m-t-12">
          <span class="color-primary">
            {{ $t("OpenTopicIssue.tags") }}
          </span>
          <span class="color-granite">
            {{
              topicTags.length
                ? topicTags.join(", ")
                : $t("OpenTopicIssue.noTags")
            }}
          </span>
        </div>
      </div>
      <div class="bcf-topic-overview__comment m-t-12">
        <BcfTopicComments
          :project="project"
          :users="users"
          :bcfTopic="bcfTopic"
        />
      </div>
    </div>
    <SafeZoneModal v-if="showDeleteModal">
      <template #text>
        {{ $t("ModalDeleteTopic.deleteText", { name: bcfTopic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton
          color="high"
          fill
          radius
          class="m-r-12"
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
    </SafeZoneModal>

    <div v-if="loading">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import { useBcf } from "../../composables/bcf.js";
import { DEFAULT_PRIORITY_COLOR, DEFAULT_STATUS_COLOR, MODEL_TYPE, MODEL_STATUS } from "../../config";
import { adjustColor } from "../../utils/adjustColor.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicComments from "./bcf-topic-comments/BcfTopicComments.vue";
import BcfTopicDefaultImage from "../bcf-topic-card/BcfTopicDefaultImage.vue";

// TODO: could be externalized ?
// import CarouselList from "@/components/generic/carousel-list/CarouselList";
import SafeZoneModal from "../safe-zone-modal/SafeZoneModal.vue";

export default {
  components: {
    // CarouselList,
    BcfTopicComments,
    BcfTopicDefaultImage,
    BIMDataButton,
    BIMDataIcon,
    BIMDataLoading,
    BIMDataTextbox,
    SafeZoneModal,
  },
  emit: ["edit-bcf-topic", "view-bcf-topic"],
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
  emits: ["close", "view-bcf-topic"],
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
