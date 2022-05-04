<template>
  <div class="bcf-topic-form">
    <div class="bcf-topic-form__content">
      <div class="bcf-topic-form__content__head">
        <div class="bcf-topic-form__content__head__index">
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic-form__content__head__date">
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>

      <template v-if="viewpointsWithSnapshot.length > 0">
        <div class="bcf-topic-form__content__images">
          <div
            class="snapshot-preview"
            v-for="viewpoint in viewpointsWithSnapshot.slice(0, 4)"
            :key="viewpoint.guid"
          >
            <img
              v-if="viewpoint.snapshot.snapshotData"
              :src="viewpoint.snapshot.snapshotData"
            />
            <BIMDataButton
              class="btn-delete"
              fill
              rounded
              icon
              @click="removeViewpoint(viewpoint)"
            >
              <BIMDataIcon name="delete" size="xs" fill color="high" />
            </BIMDataButton>
          </div>
        </div>

        <BIMDataButton
          :disabled="viewpointsWithSnapshot.length >= 4"
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
            :placeholder="$t('CreateBcfTopic.dueDateLabel')"
            :error="hasErrorDate"
            :errorMessage="$t('CreateBcfTopic.dateErrorMessage')"
            v-model="topicDate"
          />
          <div>
            {{ $t("CreateBcfTopic.dateExample") }}
          </div>
        </div>
        <BIMDataTextarea
          width="100%"
          name="description"
          :label="$t('BcfComponents.BcfTopicForm.descriptionLabel')"
          v-model="topicDescription"
          fitContent
          resizable
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
        {{ $t("BcfComponents.BcfTopicForm.editButton") }}
      </BIMDataButton>
    </div>

    <div v-if="loading" class="bcf-topic-form__loader">
      <BIMDataLoading />
    </div>

    <BIMDataSafeZoneModal v-if="openModal">
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
          @click="openModal = false"
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
    bcfTopic: {
      type: Object,
      required: true
    },
    extensions: {
      type: Object,
      reuiqred: true
    }
  },
  emits: [
    "bcf-topic-updated",
    "close",
  ],
  setup(props, { emit }) {
    const { updateTopic, deleteViewpoint } = useService();

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
    const viewpointsWithSnapshot = computed(() =>
      viewpoints.value.filter(viewpoint => Boolean(viewpoint.snapshot))
    );
    const viewpointsToDelete = [];

    const loading = ref(false);
    const hasErrorTitle = ref(false);
    const hasErrorDate = ref(false);

    watch(
      () => props.bcfTopic,
      topic => {
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
      },
      { immediate: true }
    );

    const addViewpoint = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          viewpoints.value.push({
            snapshot: {
              snapshotType: file.type,
              snapshotData: reader.result
            }
          });
        });
        reader.readAsDataURL(file);
      });
    };
    const removeViewpoint = viewpoint => {
      const index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
      if (viewpoint.guid) {
        viewpointsToDelete.push(viewpoint);
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

      const viewpointsData = viewpoints.value.map(viewpoint => {
        const json = { ...viewpoint };
        if (
          !viewpoint.snapshot &&
          "snapshot" in json
        ) {
          // Remove snapshot if it is null or undefined
          delete json.snapshot;
        }
        if (
          viewpoint.snapshot &&
          json.snapshot.snapshotData.startsWith("http")
        ) {
          // If the viewpoint is an URL, it's not a new viewpoint and we don't want to update it
          delete json.snapshot;
        }
        return json;
      });

      const data = {
        guid: props.bcfTopic.guid,
        title: topicTitle.value,
        topicType: topicType.value,
        priority: topicPriority.value,
        topicStatus: topicStatus.value,
        stage: topicStage.value,
        assignedTo: topicAssignedTo.value,
        dueDate: topicDate.value ? serialize(topicDate.value) : undefined,
        description: topicDescription.value,
        labels: topicLabels.value,
        viewpoints: viewpointsData,
      };

      await Promise.all(
        viewpointsToDelete.map(viewpoint =>
          deleteViewpoint(props.project, props.bcfTopic, viewpoint)
        )
      );
      const newTopic = await updateTopic(props.project, data);
      emit("bcf-topic-updated", newTopic);
      loading.value = false;
    };

    const openModal = ref(false);

    return {
      hasErrorDate,
      hasErrorTitle,
      loading,
      openModal,
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
      viewpointsWithSnapshot,
      // Methods
      addViewpoint,
      removeViewpoint,
      submit,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicForm.scss"></style>
