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

      <template v-if="viewpoints.length > 0">
        <div class="bcf-topic-form__content__images">
          <div
            class="snapshot-preview"
            v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
            :key="viewpoint.guid || i"
          >
            <img :src="viewpoint.snapshot.snapshotData" />
            <BIMDataButton
              class="btn-delete"
              fill
              rounded
              icon
              @click="delViewpoint(viewpoint)"
            >
              <BIMDataIcon name="delete" size="xs" fill color="high" />
            </BIMDataButton>
          </div>
        </div>

        <BIMDataButton
          :disabled="viewpoints.length >= 4"
          class="btn-upload"
          width="100%"
          color="primary"
          fill
          radius
        >
          <label for="files">
            <BIMDataIcon name="camera" size="xs" margin="0 6px 0 0" />
            {{ $t("BcfComponents.BcfTopicForm.addPictureButton") }}
          </label>
          <input
            hidden
            id="files"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            @change="addViewpoint"
          />
        </BIMDataButton>
      </template>

      <template v-else>
        <div class="bcf-topic-form__content__upload">
          <span class="icon">
            <BIMDataIcon name="unarchive" size="m" />
          </span>
          <BIMDataButton class="btn-upload" color="primary" outline radius>
            <label for="files">
              {{ $t("BcfComponents.BcfTopicForm.dragDropImageText") }}
            </label>
            <input
              hidden
              id="files"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              @change="addViewpoint"
            />
          </BIMDataButton>
        </div>
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

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataLoading,
    BIMDataSafeZoneModal,
    BIMDataSelect,
    BIMDataTextarea,
    BIMDataTextbox
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    bcfTopics: {
      type: Array,
      required: true
    },
    bcfTopic: {
      type: Object,
    },
    extensions: {
      type: Object,
      reuiqred: true
    }
  },
  emits: [
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

    const viewpointsToCreate = [];
    const viewpointsToDelete = [];

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
      loading.value = false;
      isOpenModal.value = false;
      hasErrorTitle.value = false;
      hasErrorDate.value = false;
    };

    const addViewpoint = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const viewpoint = {
            snapshot: {
              snapshotType: file.type,
              snapshotData: reader.result
            }
          };
          viewpoints.value.push(viewpoint)
          viewpointsToCreate.push(viewpoint);
        });
        reader.readAsDataURL(file);
      });
    };
    const delViewpoint = viewpoint => {
      let index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
      if (viewpoint.guid) {
        viewpointsToDelete.push(viewpoint);
      } else {
        index = viewpointsToCreate.indexOf(viewpoint);
        viewpointsToCreate.splice(index, 1);
      }
    };

    const submit = async () => {
      if (!topicTitle.value) {
        hasErrorTitle.value = true;
        return;
      }
      if (!validate(topicDate.value)) {
        hasErrorDate.value = true;
        return;
      }
      loading.value = true;

      const data = {
        guid: props.bcfTopic?.guid,
        title: topicTitle.value,
        topicType: topicType.value,
        priority: topicPriority.value,
        topicStatus: topicStatus.value,
        stage: topicStage.value,
        assignedTo: topicAssignedTo.value,
        dueDate: topicDate.value ? serialize(topicDate.value) : undefined,
        description: topicDescription.value,
        labels: topicLabels.value,
      };

      let newTopic;
      if (isCreation.value) {
        newTopic = await createTopic(props.project, data);
      } else {
        newTopic = await updateTopic(props.project, data);
      }

      await Promise.all(
        viewpointsToCreate.map(viewpoint =>
          createViewpoint(props.project, newTopic, viewpoint)
        )
      );
      await Promise.all(
        viewpointsToDelete.map(viewpoint =>
          deleteViewpoint(props.project, newTopic, viewpoint)
        )
      );

      if (isCreation.value) {
        emit("bcf-topic-created", newTopic);
        reset();
      } else {
        emit("bcf-topic-updated", newTopic);
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
      viewpoints,
      // Methods
      addViewpoint,
      delViewpoint,
      submit,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicForm.scss"></style>
