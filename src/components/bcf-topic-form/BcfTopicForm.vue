<template>
  <div class="bcf-topic-form">
    <div class="bcf-topic-form__content">
      <div class="bcf-topic-form__content__head">
        <div class="bcf-topic-form__content__head__index">
          {{ isCreation ? nextIndex : bcfTopic.index }}
        </div>
        <div class="bcf-topic-form__content__head__date">
          {{ $d(isCreation ? new Date() : bcfTopic.creationDate, "short") }}
        </div>
      </div>

      <template v-if="viewerMode">
        <BcfTopicSnapshots
          :viewpoints="viewpointsToDisplay"
          @add-viewpoint="addViewpoint"
          @delete-viewpoint="delViewpoint"
        />
        <div class="bcf-topic-form__content__actions">
          <BIMDataButton fill radius @click="$emit('add-components', bcfTopic)">
            <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
            <span>{{ $t("BcfComponents.BcfTopicForm.addObjectButton") }}</span>
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
              :disabled="viewpointsToDisplay.length === 0"
              @click="$emit('add-pins', bcfTopic)"
            >
              <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
              <span>{{ $t("BcfComponents.BcfTopicForm.addAnnotationButton") }}</span>
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
          :options="extensions.topicType"
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
          :options="extensions.topicStatus"
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
          :options="extensions.userIdType"
          v-model="topicAssignedTo"
        />
        <div class="m-b-30">
          <BIMDataInput
            margin="0"
            :placeholder="$t('BcfComponents.BcfTopicForm.dueDateLabel')"
            :error="hasErrorDate"
            :errorMessage="$t('BcfComponents.BcfTopicForm.dateErrorMessage')"
            v-model="topicDate"
          />
          <div>
            {{ $t("BcfComponents.BcfTopicForm.dateExample") }}
          </div>
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
          :options="extensions.topicLabel"
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
        {{ $t("BcfComponents.BcfTopicForm.modalText", { name: bcfTopic.title }) }}
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
import { computed, ref, watch } from "@vue/composition-api";
import { useService } from "../../service.js";
import { deserialize, serialize, validate } from "../../utils/date.js";
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
    viewerMode: {
      /**
       * Set this prop to true when using this component
       * in the context of BIMData Viewer.
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
    bcfTopics: {
      type: Array,
      required: true
    },
    bcfTopic: {
      type: Object,
    },
    models: {
      /**
       * Models list to attach to this topic if it
       * doesn't already have one (`models` field).
       */
      type: Array,
      default: () => []
    },
    providedComponents: {
      /**
       * Provided components selection that will be set
       * on each topic viewpoints (`components` field).
       */
      type: Object,
    },
    providedPins: {
      /**
       * Provided pins (annotations) that will be set
       * on each topic viewpoints (`pins` field).
       */
      type: Array,
    },
  },
  emits: [
    "add-components",
    "add-pins",
    "bcf-topic-created",
    "bcf-topic-updated",
    "close",
  ],
  setup(props, { emit }) {
    const {
      createTopic,
      updateTopic,
      createViewpoint,
      deleteViewpoint
    } = useService();

    const isCreation = computed(
      () => !props.bcfTopic
    );
    const nextIndex = computed(
      () => props.bcfTopics.length > 0
        ? Math.max(...props.bcfTopics.map(t => t.index)) + 1
        : 1
    );

    const topicTitle = ref("");
    const topicType = ref(null);
    const topicPriority = ref(null);
    const topicStatus = ref(null);
    const topicStage = ref(null);
    const topicAssignedTo = ref(null);
    const topicDate = ref("");
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
      () => props.bcfTopic,
      topic => {
        if (!isCreation.value) {
          topicTitle.value = topic.title || "";
          topicType.value = topic.topicType || null;
          topicPriority.value = topic.priority || null;
          topicStatus.value = topic.topicStatus || null;
          topicStage.value = topic.stage || null;
          topicAssignedTo.value = topic.assignedTo || null;
          topicDate.value = topic.dueDate ? deserialize(topic.dueDate) : "";
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
      topicDate.value = "";
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
      if (!validate(topicDate.value) && topicDate.value !== deserialize(props.bcfTopic.dueDate)) {
        hasErrorDate.value = true;
        return;
      }
      try {
        loading.value = true;

        // Avoid updating snapshots as it is not possible.
        // (you can only create/delete snapshots)
        viewpointsToUpdate.value = viewpoints.value.map(
          viewpoint => ({ ...viewpoint, snapshot: undefined })
        );

        if (props.providedComponents) {
          if (
            viewpointsToUpdate.value.length > 0 ||
            viewpointsToCreate.value.length > 0
          ) {
            viewpointsToUpdate.value.forEach(
              viewpoint => viewpoint.components = props.providedComponents
            );
            viewpointsToCreate.value.forEach(
              viewpoint => viewpoint.components = props.providedComponents
            );
          } else {
            // If components selection is provided and no viewpoints
            // are set then create a viewpoint without snapshot to hold
            // components selection.
            viewpointsToCreate.value.push({
              components: props.providedComponents
            });
          }
        }
        if (props.providedPins) {
          viewpointsToUpdate.value.forEach(
            viewpoint => viewpoint.pins = props.providedPins
          );
          viewpointsToCreate.value.forEach(
            viewpoint => viewpoint.pins = props.providedPins
          );
        }

        const data = {
          guid: props.bcfTopic?.guid,
          models: props.bcfTopic?.models || props.models,
          title: topicTitle.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicStage.value,
          assignedTo: topicAssignedTo.value,
          dueDate: topicDate.value ? serialize(topicDate.value) : undefined,
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
          emit("bcf-topic-created", newTopic);
          reset();
        } else {
          emit("bcf-topic-updated", newTopic);
        }
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
      topicDate,
      topicDescription,
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
