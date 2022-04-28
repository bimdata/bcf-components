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
          <img :src="viewpoint.snapshot.snapshot_data" loading="lazy" />
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
            @change="upload"
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
          @change="upload"
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
        :error="hasError"
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
        v-model="topicPhase"
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
          :error="hasDateError"
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
        v-model="topicTags"
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
import { computed, ref, watch } from "@vue/composition-api";
import { useBcf } from "../../composables/bcf.js";
import { formatToDateObject, regexDate } from "../../utils/date.js";
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
  emits: ["submit"],
  setup(props) {
    // TODO: could be provided by parent ?
    const { createFullTopic } = useBcf();

    const nextIndex = computed(() => {
      if (props.bcfTopics && props.bcfTopics.length > 0) {
        return (
          props.bcfTopics.reduce(
            (acc, cur) => (cur.index > acc ? cur.index : acc),
            0
          ) + 1
        );
      } else {
        return 1;
      }
    });

    const viewpoints = ref([]);
    const upload = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          viewpoints.value.push({
            snapshot: {
              snapshot_type: file.type,
              snapshot_data: reader.result
            }
          });
        });
        reader.readAsDataURL(file);
      });
    };

    const removeViewpoint = index => {
      viewpoints.value.splice(index, 1);
    };

    const topicTitle = ref("");
    const topicDescription = ref("");
    const topicType = ref();
    const topicPriority = ref();
    const topicStatus = ref();
    const topicPhase = ref();
    const topicAssignedTo = ref();
    const topicDate = ref("");
    const topicTags = ref([]);
    const hasError = ref(false);
    const hasDateError = ref(false);
    const loading = ref(false);

    const isDateConform = date => {
      if (!date) {
        return true;
      }
      if (!date.match(regexDate)) {
        return false;
      }
      const dateToCompare = formatToDateObject(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dateToCompare.getTime() >= today.getTime();
    };

    const submit = async () => {
      if (!isDateConform(topicDate.value) || !topicTitle.value) {
        hasDateError.value = true;
        return;
      }
      const body = {
        title: topicTitle.value,
        topic_type: topicType.value?.topicType,
        priority: topicPriority.value?.priority,
        topic_status: topicStatus.value?.topicStatus,
        stage: topicPhase.value?.stage,
        assigned_to: topicAssignedTo?.value,
        description: topicDescription?.value,
        labels: topicTags.value?.map(topicTag => topicTag.label),
        viewpoints: viewpoints.value
      };
      if (topicDate.value) {
        body.dueDate = formatToDateObject(topicDate.value);
      }
      loading.value = true;
      await createFullTopic(props.project, body);
      topicTitle.value = "";
      topicType.value = null;
      topicPriority.value = null;
      topicStatus.value = null;
      topicPhase.value = null;
      topicAssignedTo.value = null;
      topicDate.value = "";
      topicDescription.value = "";
      topicTags.value = [];
      viewpoints.value = [];
      hasDateError.value = false;
      loading.value = false;
    };

    return {
      // References
      hasDateError,
      hasError,
      loading,
      nextIndex,
      topicAssignedTo,
      topicDate,
      topicDescription,
      topicPhase,
      topicPriority,
      topicStatus,
      topicTags,
      topicTitle,
      topicType,
      viewpoints,
      // Methods
      removeViewpoint,
      submit,
      upload
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicCreate.scss"></style>
