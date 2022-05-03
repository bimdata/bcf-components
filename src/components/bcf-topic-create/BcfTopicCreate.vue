<template>
  <div class="bcf-topic-create">
    <div class="bcf-topic-create__header flex items-center justify-between">
      <div
        class="bcf-topic-create__header__index flex items-center justify-center"
      >
        {{ nextIndex }}
      </div>
      <div
        class="bcf-topic-create__header__date flex items-center justify-center"
      >
        {{ $d(new Date(), "short") }}
      </div>
    </div>

    <div
      class="bcf-topic-create__image flex items-center justify-center m-t-24"
      :class="{ 'no-img': !viewpoints.length > 0 }"
    >
      <div v-if="viewpoints.length > 0" class="img-previews flex">
        <div
          class="img-preview"
          v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
          :key="i"
        >
          <img :src="viewpoint.snapshot.snapshotData" loading="lazy" />
          <BIMDataButton
            class="remove-viewpoint"
            color="default"
            fill
            rounded
            icon
            @click="removeViewpoint(i)"
          >
            <BIMDataIcon name="delete" size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
      <div v-else class="img-input flex flex-col items-center justify-center">
        <span class="flex items-center justify-center">
          <BIMDataIcon name="unarchive" fill color="default" size="m" />
        </span>
        <BIMDataButton color="primary" outline radius class="m-t-18">
          <label for="files">
            {{ $t("BcfComponents.BcfTopicCreate.dragDropImageText") }}
          </label>
          <input
            style="display: none"
            id="files"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            @change="addViewpoint"
          />
        </BIMDataButton>
      </div>
    </div>

    <div
      v-if="viewpoints.length > 0"
      class="bcf-topic-create__add-img flex justify-center m-t-18"
    >
      <BIMDataButton
        :disabled="viewpoints.length >= 4"
        width="100%"
        color="primary"
        fill
        radius
      >
        <input
          style="display: none"
          :disabled="viewpoints.length >= 4"
          id="files"
          type="file"
          multiple
          accept="image/png, image/jpeg"
          @change="addViewpoint"
        />
        <label for="files" class="flex items-center justify-center">
          <BIMDataIcon name="camera" size="xs" margin="0 12px 0 0" />
          {{ $t("BcfComponents.BcfTopicCreate.addPictureButton") }}
        </label>
      </BIMDataButton>
    </div>

    <div class="bcf-topic-create__content m-t-36">
      <BIMDataInput
        :placeholder="$t('BcfComponents.BcfTopicCreate.titlePlaceholder')"
        :error="hasErrorTitle"
        :errorMessage="$t('BcfComponents.BcfTopicCreate.titleErrorMessage')"
        v-model="topicTitle"
        @keyup.enter.stop="submit"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('BcfComponents.BcfTopicCreate.typeLabel')"
        :options="detailedExtensions.topicTypes"
        optionKey="id"
        optionLabelKey="topicType"
        v-model="topicType"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('BcfComponents.BcfTopicCreate.priorityLabel')"
        :options="detailedExtensions.priorities"
        optionKey="id"
        optionLabelKey="priority"
        v-model="topicPriority"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('BcfComponents.BcfTopicCreate.statusLabel')"
        :options="detailedExtensions.topicStatuses"
        optionKey="id"
        optionLabelKey="topicStatus"
        v-model="topicStatus"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('BcfComponents.BcfTopicCreate.stageLabel')"
        :options="detailedExtensions.stages"
        optionKey="id"
        optionLabelKey="stage"
        v-model="topicStage"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('BcfComponents.BcfTopicCreate.assignedToLabel')"
        :options="extensions.userIdType"
        v-model="topicAssignedTo"
      />
      <div class="due-date">
        <BIMDataInput
          margin="0"
          :placeholder="$t('BcfComponents.BcfTopicCreate.dueDateLabel')"
          :error="hasErrorDate"
          :errorMessage="$t('BcfComponents.BcfTopicCreate.dateErrorMessage')"
          v-model="topicDate"
        />
        <p class="m-y-6">
          {{ $t("BcfComponents.BcfTopicCreate.dateExample") }}
        </p>
      </div>
      <BIMDataTextarea
        width="100%"
        name="description"
        :label="$t('BcfComponents.BcfTopicCreate.descriptionLabel')"
        v-model="topicDescription"
        fitContent
        resizable
      />
      <BIMDataSelect
        width="100%"
        :multi="true"
        :label="$t('BcfComponents.BcfTopicCreate.tagsLabel')"
        :options="detailedExtensions.topicLabels"
        optionKey="id"
        optionLabelKey="label"
        v-model="topicLabels"
      />
    </div>

    <div class="bcf-topic-create__footer m-t-24">
      <BIMDataButton
        :disabled="topicTitle === ''"
        width="100%"
        color="primary"
        fill
        radius
        @click="submit"
      >
        {{ $t("BcfComponents.BcfTopicCreate.validateButton") }}
      </BIMDataButton>
    </div>

    <div v-if="loading" class="overlay flex items-center justify-center">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import { useService } from "../../service.js";
import { serialize, validate } from "../../utils/date.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSelect.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataLoading,
    BIMDataSelect,
    BIMDataTextarea,
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
    extensions: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    },
  },
  emits: [
    "bcf-topic-created"
  ],
  setup(props, { emit }) {
    const { createTopic } = useService();

    const nextIndex = computed(() => {
      if (props.bcfTopics && props.bcfTopics.length > 0) {
        return (
          props.bcfTopics.reduce(
            (maxIndex, topic) => (topic.index > maxIndex ? topic.index : maxIndex),
            0
          ) + 1
        );
      } else {
        return 1;
      }
    });

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

    const loading = ref(false);
    const hasErrorTitle = ref(false);
    const hasErrorDate = ref(false);

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
      hasErrorTitle.value = false;
      hasErrorDate.value = false;
    };

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
    const removeViewpoint = index => {
      viewpoints.value.splice(index, 1);
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
      const data = {
        title: topicTitle.value,
        topicType: topicType.value?.topicType,
        priority: topicPriority.value?.priority,
        topicStatus: topicStatus.value?.topicStatus,
        stage: topicStage.value?.stage,
        assignedTo: topicAssignedTo?.value,
        dueDate: topicDate.value ? serialize(topicDate.value) : undefined,
        description: topicDescription?.value,
        labels: topicLabels.value?.map(l => l.label),
        viewpoints: viewpoints.value,
      };
      loading.value = true;
      const newTopic = await createTopic(props.project, data);
      emit("bcf-topic-created", newTopic);
      loading.value = false;
      reset();
    };

    return {
      // References
      hasErrorDate,
      hasErrorTitle,
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
      removeViewpoint,
      submit,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicCreate.scss"></style>
