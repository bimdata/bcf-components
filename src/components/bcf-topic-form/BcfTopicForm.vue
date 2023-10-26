<template>
  <div class="bcf-topic-form">
    <div class="bcf-topic-form__header">
      <BIMDataButton v-if="uiConfig.backButton" ghost rounded icon @click="$emit('back')">
        <BIMDataIconArrow size="xxs" fill color="granite-light" />
      </BIMDataButton>
      <div class="bcf-topic-form__header__title">
        <template v-if="isCreation">
          {{ $t("BcfComponents.BcfTopicForm.createTitle") }}
        </template>
        <template v-else>
          <BIMDataTextbox maxWidth="250px" :text="topic.title" />
        </template>
      </div>
      <BIMDataButton v-if="uiConfig.closeButton" ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <div class="bcf-topic-form__content">
      <div class="bcf-topic-form__content__head">
        <div class="bcf-topic-form__content__head__index">
          {{ isCreation ? nextIndex : topic.index }}
        </div>
        <div class="bcf-topic-form__content__head__date">
          {{ $d(isCreation ? new Date() : topic.creation_date, "short") }}
        </div>
      </div>

      <template v-if="uiConfig.viewerMode">
        <BcfTopicSnapshots
          :viewpoints="viewpointsToDisplay"
          @create-viewpoint="createViewpoints"
          @upload-viewpoint="uploadViewpoints"
          @delete-viewpoint="deleteViewpoint"
        />
        <div class="bcf-topic-form__content__actions">
          <BcfTopicSnapshotsActions
            v-if="viewpointsToDisplay.length > 0"
            :viewpoints="viewpointsToDisplay"
            @create-viewpoint="createViewpoints"
            @upload-viewpoint="uploadViewpoints"
          />
          <BIMDataButton
            fill
            radius
            :disabled="!objectsEditEnabled"
            @click="$emit('edit-topic-objects', topic)"
          >
            <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
            <span>
              {{ $t("BcfComponents.BcfTopicForm.addObjectButton") }}
            </span>
            <span v-if="topicObjects" class="count-objects">
              {{ topicObjects.selection.length }}
            </span>
          </BIMDataButton>
          <BIMDataTooltip
            :disabled="viewpointsToDisplay.length > 0"
            :text="$t('BcfComponents.BcfTopicForm.annotationButtonTooltip')"
            color="granite-light"
          >
            <BIMDataButton
              width="100%"
              color="primary"
              fill
              radius
              :disabled="!annotationsEditEnabled || viewpointsToDisplay.length === 0"
              @click="$emit('edit-topic-annotations', topic)"
            >
              <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
              <span>
                {{ $t("BcfComponents.BcfTopicForm.addAnnotationButton") }}
              </span>
              <span v-if="topicAnnotations" class="count-annotations">
                {{ topicAnnotations.length }}
              </span>
            </BIMDataButton>
          </BIMDataTooltip>
        </div>
      </template>
      <template v-else>
        <BcfTopicImages
          :viewpoints="viewpointsToDisplay"
          @upload-viewpoint="uploadViewpoints"
          @delete-viewpoint="deleteViewpoint"
        />
      </template>

      <div class="bcf-topic-form__content__body">
        <BIMDataInput
          :placeholder="$t('BcfComponents.BcfTopicForm.titlePlaceholder')"
          :error="hasErrorTitle"
          :errorMessage="$t('BcfComponents.BcfTopicForm.titleErrorMessage')"
          v-model="topicTitle"
          @keyup.enter.stop="submit"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.typeLabel')"
          :options="extensions.topic_type"
          :disabled="extensions.topic_type.length === 0"
          v-model="topicType"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.priorityLabel')"
          :options="extensions.priority"
          :disabled="extensions.priority.length === 0"
          v-model="topicPriority"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.statusLabel')"
          :options="extensions.topic_status"
          :disabled="extensions.topic_status.length === 0"
          v-model="topicStatus"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.stageLabel')"
          :options="extensions.stage"
          :disabled="extensions.stage.length === 0"
          v-model="topicStage"
        />
        <BIMDataSelect
          width="100%"
          :search="true"
          :clearSearchOnLeave="true"
          :label="$t('BcfComponents.BcfTopicForm.assignedToLabel')"
          :options="extensions.user_id_type"
          :disabled="extensions.user_id_type.length === 0"
          v-model="topicAssignedTo"
          :searchPlaceholder="$t('BcfComponents.BcfTopicForm.searchPlaceholder')"
        >
          <template #empty> <span class="color-granite p-x-12">{{ $t('BcfComponents.BcfTopicForm.emptySearch') }}</span> </template>
        </BIMDataSelect>
        <div class="m-b-30">
          <BIMDataDatePicker
            width="100%"
            :placeholder="$t('BcfComponents.BcfTopicForm.dueDateLabel')"
            :value="topicDueDate"
            v-model="topicDueDate"
            :clearButton="true"
          />
        </div>
        <BIMDataTextarea
          width="100%"
          name="description"
          :label="$t('BcfComponents.BcfTopicForm.descriptionLabel')"
          v-model="topicDescription"
          fitContent
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.labelsLabel')"
          :options="extensions.topic_label"
          :disabled="extensions.topic_label.length === 0"
          v-model="topicLabels"
          :multi="true"
        />
      </div>
    </div>

    <div class="bcf-topic-form__footer">
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        :disabled="!topicTitle"
        @click="submit"
      >
        {{ $t(`BcfComponents.BcfTopicForm.${isCreation ? "createButton" : "updateButton"}`) }}
      </BIMDataButton>
    </div>

    <div v-if="loading" class="bcf-topic-form__loader">
      <BIMDataLoading />
    </div>

    <BIMDataSafeZoneModal v-if="isOpenModal">
      <template #text>
        {{ $t("BcfComponents.BcfTopicForm.modalText", { name: topic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton class="m-r-12" color="high" fill radius @click="$emit('close')">
          {{ $t("BcfComponents.BcfTopicForm.cancelButton") }}
        </BIMDataButton>
        <BIMDataButton color="primary" outline radius @click="isOpenModal = false">
          {{ $t("BcfComponents.BcfTopicForm.continueButton") }}
        </BIMDataButton>
      </template>
    </BIMDataSafeZoneModal>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import service from "../../service.js";
import { getViewerList } from "../../utils/viewer.js";
import { setViewpointDefaults } from "../../utils/viewpoints.js";
// Components
import BcfTopicImages from "./bcf-topic-images/BcfTopicImages.vue";
import BcfTopicSnapshots from "./bcf-topic-snapshots/BcfTopicSnapshots.vue";
import BcfTopicSnapshotsActions from "./bcf-topic-snapshots-actions/BcfTopicSnapshotsActions.vue";

export default {
  components: {
    BcfTopicImages,
    BcfTopicSnapshots,
    BcfTopicSnapshotsActions,
  },
  props: {
    uiConfig: {
      type: Object,
      default: () => ({
        viewerMode: false, // set this to true when used in BIMData Viewer
        backButton: false,
        closeButton: false,
      }),
    },
    objectsEditEnabled: {
      /**
       * Whether topic objects edition is enabled or not.
       */
      type: Boolean,
      default: false,
    },
    annotationsEditEnabled: {
      /**
       * Whether annotations edition is enabled or not.
       */
      type: Boolean,
      default: false,
    },
    project: {
      type: Object,
      required: true,
    },
    extensions: {
      type: Object,
      reuiqred: true,
    },
    topics: {
      type: Array,
      required: true,
    },
    topic: {
      type: Object,
    },
    topicObjects: {
      /**
       * Objects selection that will be set on each topic viewpoints
       * (override `components` field).
       */
      type: Object,
    },
    topicAnnotations: {
      /**
       * Annotations that will be set on each topic viewpoints
       * (override `pins` field).
       */
      type: Array,
    },
    getViewers: {
      type: Function,
      default: () => () => ({})
    },
  },
  emits: [
    "back",
    "close",
    "edit-topic-annotations",
    "edit-topic-objects",
    "topic-created",
    "topic-create-error",
    "topic-updated",
    "topic-update-error",
  ],
  setup(props, { emit }) {
    const isCreation = computed(() => !props.topic);
    const nextIndex = computed(() => Math.max(0, ...props.topics.map((t) => t.index)) + 1);

    const topicTitle = ref("");
    const topicType = ref(null);
    const topicPriority = ref(null);
    const topicStatus = ref(null);
    const topicStage = ref(null);
    const topicAssignedTo = ref(null);
    const topicDueDate = ref(null);
    const topicDescription = ref("");
    const topicLabels = ref([]);
    const viewpoints = ref([]);

    const viewpointsToCreate = ref([]);
    const viewpointsToUpdate = ref([]);
    const viewpointsToDelete = ref([]);
    const viewpointsToDisplay = computed(() =>
      viewpoints.value
        .concat(viewpointsToCreate.value)
        .filter((v) => !viewpointsToDelete.value.some((x) => x.guid === v.guid))
        .filter((v) => v.snapshot)
    );

    const hasErrorTitle = ref(false);
    const isOpenModal = ref(false);
    const loading = ref(false);

    const reset = () => {
      topicTitle.value = "";
      topicType.value = null;
      topicPriority.value = null;
      topicStatus.value = null;
      topicStage.value = null;
      topicAssignedTo.value = null;
      topicDueDate.value = null;
      topicDescription.value = "";
      topicLabels.value = [];
      viewpoints.value = [];
      viewpointsToCreate.value = [];
      viewpointsToUpdate.value = [];
      viewpointsToDelete.value = [];
      hasErrorTitle.value = false;
      isOpenModal.value = false;
      loading.value = false;
    };

    watch(
      () => props.topic,
      (topic) => {
        if (topic) {
          topicTitle.value = topic.title || "";
          topicType.value = topic.topic_type || null;
          topicPriority.value = topic.priority || null;
          topicStatus.value = topic.topic_status || null;
          topicStage.value = topic.stage || null;
          topicAssignedTo.value = topic.assigned_to || null;
          topicDueDate.value = topic.due_date;
          topicDescription.value = topic.description || "";
          topicLabels.value = topic.labels || [];
          viewpoints.value = topic.viewpoints || [];
        } else {
          reset();
        }
      },
      { immediate: true }
    );

    const createViewpoints = () => {
      Promise.all(
        getViewerList(props.getViewers()).map(viewer =>
          viewer.getViewpoint().then(viewpoint => viewpointsToCreate.value.push(viewpoint))
        )
      );
    };

    const uploadViewpoints = (event) => {
      [...event.target.files].forEach((file) => {
        let type;
        if (file.type === "image/png") {
          type = "png";
        } else if (file.type === "image/jpeg") {
          type = "jpg"; // `jpeg` is not a valid value, only `jpg` is
        } else {
          type = file.type;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const viewpoint = {
            isUpload: true,
            snapshot: {
              snapshot_type: type,
              snapshot_data: reader.result,
            },
          };
          viewpointsToCreate.value.push(viewpoint);
        });
        reader.readAsDataURL(file);
      });
    };

    const deleteViewpoint = (viewpoint) => {
      if (viewpoint.guid) {
        viewpointsToDelete.value.push(viewpoint);
      } else {
        let index = viewpointsToCreate.value.indexOf(viewpoint);
        viewpointsToCreate.value.splice(index, 1);
      }
    };

    const submit = async () => {
      if (!topicTitle.value) {
        hasErrorTitle.value = true;
        return;
      }
      try {
        loading.value = true;

        // Avoid updating snapshots as it is not possible
        // (you can only create/delete snapshots).
        viewpointsToUpdate.value = viewpoints.value.map((viewpoint) => ({
          ...viewpoint,
          snapshot: undefined,
        }));

        if (viewpointsToUpdate.value.length === 0) {
          // If topic has no viewpoints yet make sure 3D viewpoints
          // comes first in the list of viewpoints to create.
          viewpointsToCreate.value.sort(
            (v1, v2) => (v1.order ?? Infinity) - (v2.order ?? Infinity)
          );
        }

        const allViewpoints = viewpointsToUpdate.value.concat(viewpointsToCreate.value);

        if (props.topicObjects) {
          if (allViewpoints.length > 0) {
            // Set provided topic objects on all viewpoints.
            allViewpoints.forEach((viewpoint) => {
              Object.assign(viewpoint, { components: props.topicObjects });
              setViewpointDefaults(viewpoint);
            });
          } else {
            // If topic objects are provided and no viewpoints are set
            // then create an 'empty' viewpoint to hold topic objects.
            viewpointsToCreate.value.push({ components: props.topicObjects });
          }
        }

        if (props.topicAnnotations) {
          // Set provided topic annotations on all viewpoints.
          allViewpoints.forEach((viewpoint) => (viewpoint.pins = props.topicAnnotations));
        }

        const data = {
          guid: props.topic?.guid,
          title: topicTitle.value,
          topic_type: topicType.value,
          priority: topicPriority.value,
          topic_status: topicStatus.value,
          stage: topicStage.value,
          assigned_to: topicAssignedTo.value,
          due_date: topicDueDate.value,
          description: topicDescription.value,
          labels: topicLabels.value,
        };

        let newTopic;
        if (isCreation.value) {
          data.models = getViewerList(props.getViewers())
            .flatMap(v => v.getLoadedModels().map(m => m.id));
          newTopic = await service.createTopic(props.project, data);
        } else {
          newTopic = await service.updateTopic(props.project, data);
        }

        await Promise.all([
          ...viewpointsToCreate.value.map((viewpoint) =>
            service.createViewpoint(props.project, newTopic, viewpoint)
          ),
          ...viewpointsToUpdate.value.map((viewpoint) =>
            service.updateViewpoint(props.project, newTopic, viewpoint)
          ),
          ...viewpointsToDelete.value.map((viewpoint) =>
            service.deleteViewpoint(props.project, newTopic, viewpoint)
          ),
        ]);

        if (isCreation.value) {
          emit("topic-created", newTopic);
          reset();
        } else {
          emit("topic-updated", newTopic);
        }
      } catch (error) {
        console.error(error);
        emit(isCreation.value ? "topic-create-error" : "topic-update-error", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      hasErrorTitle,
      isCreation,
      isOpenModal,
      loading,
      nextIndex,
      topicAssignedTo,
      topicDescription,
      topicDueDate,
      topicPriority,
      topicStage,
      topicStatus,
      topicLabels,
      topicTitle,
      topicType,
      viewpointsToDisplay,
      // Methods
      createViewpoints,
      uploadViewpoints,
      deleteViewpoint,
      submit,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicForm.scss"></style>
