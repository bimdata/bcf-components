<template>
  <div class="bcf-topic-form">
    <div class="bcf-topic-form__header">
      <BIMDataButton
        v-if="uiConfig.backButton"
        ghost rounded icon
        @click="$emit('back')"
      >
        <BIMDataIcon name="arrow" size="xxs"  fill color="granite-light" />
      </BIMDataButton>
      <div class="bcf-topic-form__header__title">
        <template v-if="isCreation">
          {{ $t("BcfComponents.BcfTopicForm.createTitle") }}
        </template>
        <template v-else>
          <BIMDataTextbox maxWidth="250px" :text="topic.title" />
        </template>
      </div>
      <BIMDataButton
        v-if="uiConfig.closeButton"
        ghost rounded icon
        @click="$emit('close')"
      >
        <BIMDataIcon name="close" size="xxs"  fill color="granite-light" />
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
          @add-viewpoint="addViewpoint"
          @delete-viewpoint="delViewpoint"
        />
        <div class="bcf-topic-form__content__actions">
          <BIMDataButton
            fill
            radius
            :disabled="!objectsEditEnabled"
            @click="$emit('edit-topic-objects', topic)"
          >
            <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
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
              <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
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
          @add-viewpoint="addViewpoint"
          @delete-viewpoint="delViewpoint"
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
          v-model="topicType"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.priorityLabel')"
          :options="extensions.priority"
          v-model="topicPriority"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.statusLabel')"
          :options="extensions.topic_status"
          v-model="topicStatus"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.stageLabel')"
          :options="extensions.stage"
          v-model="topicStage"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicForm.assignedToLabel')"
          :options="extensions.user_id_type"
          v-model="topicAssignedTo"
        />
        <div class="m-b-30">
          <BIMDataInput
            margin="0"
            :placeholder="$t('BcfComponents.BcfTopicForm.dueDateLabel')"
            :error="hasErrorDate"
            :errorMessage="$t('BcfComponents.BcfTopicForm.dateErrorMessage')"
            v-model="topicDueDate"
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
          :multi="true"
          :label="$t('BcfComponents.BcfTopicForm.labelsLabel')"
          :options="extensions.topic_label"
          v-model="topicLabels"
        />
      </div>
    </div>

    <div class="bcf-topic-form__footer">
      <BIMDataButton
        :disabled="!topicTitle"
        width="100%"
        color="primary"
        fill
        radius
        @click="submit"
      >
        {{ $t(`BcfComponents.BcfTopicForm.${
            isCreation ? 'createButton' : 'updateButton'
        }`) }}
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
        <BIMDataButton
          class="m-r-12"
          color="high"
          fill
          radius
          @click="$emit('close')"
        >
          {{ $t("BcfComponents.BcfTopicForm.cancelButton") }}
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="isOpenModal = false"
        >
          {{ $t("BcfComponents.BcfTopicForm.continueButton") }}
        </BIMDataButton>
      </template>
    </BIMDataSafeZoneModal>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useService } from "../../service.js";
import { deserialize, serialize, validateDueDate } from "../../utils/date.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataSafeZoneModal from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSafeZoneModal.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSelect.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BIMDataTooltip from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTooltip.js";
import BcfTopicImages from "./bcf-topic-images/BcfTopicImages.vue";
import BcfTopicSnapshots from "./bcf-topic-snapshots/BcfTopicSnapshots.vue";

export default {
  components: {
    BcfTopicImages,
    BcfTopicSnapshots,
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataLoading,
    BIMDataSafeZoneModal,
    BIMDataSelect,
    BIMDataTextarea,
    BIMDataTextbox,
    BIMDataTooltip,
  },
  props: {
    uiConfig: {
      type: Object,
      default: () => ({
        viewerMode: false, // set this to true when used in BIMData Viewer
        backButton: false,
        closeButton: false,
      })
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
      required: true
    },
    extensions: {
      type: Object,
      reuiqred: true
    },
    topics: {
      type: Array,
      required: true
    },
    topic: {
      type: Object,
    },
    topicModels: {
      /**
       * Models list to attach to this topic if it
       * doesn't already have one (`models` field).
       */
      type: Array,
      default: () => []
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
    const {
      createTopic,
      updateTopic,
      createViewpoint,
      deleteViewpoint
    } = useService();

    const isCreation = computed(
      () => !props.topic
    );
    const nextIndex = computed(
      () => Math.max(0, ...props.topics.map(t => t.index)) + 1
    );

    const topicTitle = ref("");
    const topicType = ref(null);
    const topicPriority = ref(null);
    const topicStatus = ref(null);
    const topicStage = ref(null);
    const topicAssignedTo = ref(null);
    const topicDueDate = ref("");
    const topicDescription = ref("");
    const topicLabels = ref([]);
    const viewpoints = ref([]);

    const viewpointsToCreate = ref([]);
    const viewpointsToUpdate = ref([]);
    const viewpointsToDelete = ref([]);
    const viewpointsToDisplay = computed(() =>
      viewpoints.value
        .concat(viewpointsToCreate.value)
        .filter(v => !viewpointsToDelete.value.some(x => x.guid === v.guid))
        .filter(v => v.snapshot)
    );

    const loading = ref(false);
    const isOpenModal = ref(false);
    const hasErrorTitle = ref(false);
    const hasErrorDate = ref(false);

    watch(
      () => props.topic,
      topic => {
        if (!isCreation.value) {
          topicTitle.value = topic.title || "";
          topicType.value = topic.topic_type || null;
          topicPriority.value = topic.priority || null;
          topicStatus.value = topic.topic_status || null;
          topicStage.value = topic.stage || null;
          topicAssignedTo.value = topic.assigned_to || null;
          topicDueDate.value = topic.due_date ? deserialize(topic.due_date) : "";
          topicDescription.value = topic.description || "";
          topicLabels.value = topic.labels || [];
          viewpoints.value = topic.viewpoints || [];
        }
      },
      { immediate: true }
    );

    const reset = () => {
      topicTitle.value = "";
      topicType.value = null;
      topicPriority.value = null;
      topicStatus.value = null;
      topicStage.value = null;
      topicAssignedTo.value = null;
      topicDueDate.value = "";
      topicDescription.value = "";
      topicLabels.value = [];
      viewpoints.value = [];
      viewpointsToCreate.value = [];
      viewpointsToUpdate.value = [];
      viewpointsToDelete.value = [];
      loading.value = false;
      isOpenModal.value = false;
      hasErrorTitle.value = false;
      hasErrorDate.value = false;
    };

    const addViewpoint = viewpoint => {
      viewpointsToCreate.value.push(viewpoint);
    };

    const delViewpoint = viewpoint => {
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
      if (
        topicDueDate.value !== deserialize(props.topic.due_date) &&
        !validateDueDate(topicDueDate.value)
      ) {
        hasErrorDate.value = true;
        return;
      }
      try {
        loading.value = true;

        // Avoid updating snapshots as it is not possible
        // (you can only create/delete snapshots).
        viewpointsToUpdate.value = viewpoints.value.map(
          viewpoint => ({ ...viewpoint, snapshot: undefined })
        );

        if (viewpointsToUpdate.value.length === 0) {
          // If topic has no viewpoints yet make sure 3D viewpoints
          // comes first in the list of viewpoints to create.
          viewpointsToCreate.value.sort((v1, v2) => (v1.order ?? Infinity) - (v2.order ?? Infinity));
        }

        if (props.topicObjects) {
          if (
            viewpointsToUpdate.value.length > 0 ||
            viewpointsToCreate.value.length > 0
          ) {
            [
              ...viewpointsToUpdate.value,
              ...viewpointsToCreate.value
            ].forEach(viewpoint => {
              Object.assign(viewpoint, props.topicObjects);
              if (!viewpoint.components) {
                viewpoint.components = {};
              }
              if (!viewpoint.components.selection) {
                viewpoint.components.selection = [];
              }
              if (!viewpoint.components.visibility) {
                viewpoint.components.visibility = {
                  default_visibility: true,
                  exceptions: [],
                  view_setup_hints: {
                    spaces_visible: false,
                    space_boundaries_visible: false,
                    openings_visible: false,
                  },
                };
              }
            });
          } else {
            // If components selection is provided and no viewpoints
            // are set then create a viewpoint without snapshot to hold
            // components selection.
            viewpointsToCreate.value.push({
              components: props.topicObjects
            });
          }
        }
        if (props.topicAnnotations) {
          [
            ...viewpointsToUpdate.value,
            ...viewpointsToCreate.value
          ].forEach(
            viewpoint => viewpoint.pins = props.topicAnnotations
          );
        }

        const data = {
          guid: props.topic?.guid,
          models: props.topic?.models || props.topicModels,
          title: topicTitle.value,
          topic_type: topicType.value,
          priority: topicPriority.value,
          topic_status: topicStatus.value,
          stage: topicStage.value,
          assigned_to: topicAssignedTo.value,
          due_date: topicDueDate.value ? serialize(topicDueDate.value) : undefined,
          description: topicDescription.value,
          labels: topicLabels.value,
          viewpoints: viewpointsToUpdate.value,
        };

        let newTopic;
        if (isCreation.value) {
          newTopic = await createTopic(props.project, data);
        } else {
          newTopic = await updateTopic(props.project, data);
        }

        await Promise.all(
          viewpointsToCreate.value.map(viewpoint =>
            createViewpoint(props.project, newTopic, viewpoint)
          )
        );
        await Promise.all(
          viewpointsToDelete.value.map(viewpoint =>
            deleteViewpoint(props.project, newTopic, viewpoint)
          )
        );

        if (isCreation.value) {
          emit("topic-created", newTopic);
          reset();
        } else {
          emit("topic-updated", newTopic);
        }
      } catch (error) {
        emit(isCreation.value ? "topic-create-error" : "topic-update-error", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      hasErrorDate,
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
      addViewpoint,
      delViewpoint,
      submit,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicForm.scss"></style>
