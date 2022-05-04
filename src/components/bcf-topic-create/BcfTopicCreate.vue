<template>
  <div class="bcf-topic-create">
    <div class="bcf-topic-create__content">
      <div class="bcf-topic-create__content__head">
        <div class="bcf-topic-create__content__head__index">
          {{ nextIndex }}
        </div>
        <div class="bcf-topic-create__content__head__date">
          {{ $d(new Date(), "short") }}
        </div>
      </div>

      <template v-if="viewpoints.length > 0">
        <div class="bcf-topic-create__content__images">
          <div
            class="snapshot-preview"
            v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
            :key="i"
          >
            <img :src="viewpoint.snapshot.snapshotData" />
            <BIMDataButton
              class="btn-delete"
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
            {{ $t("BcfComponents.BcfTopicCreate.addPictureButton") }}
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
        <div class="bcf-topic-create__content__upload">
          <span class="icon">
            <BIMDataIcon name="unarchive" size="m" />
          </span>
          <BIMDataButton class="btn-upload" color="primary" outline radius>
            <label for="files">
              {{ $t("BcfComponents.BcfTopicCreate.dragDropImageText") }}
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

      <div class="bcf-topic-create__content__body">
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
          :options="extensions.topicType"
          v-model="topicType"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicCreate.priorityLabel')"
          :options="extensions.priority"
          v-model="topicPriority"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicCreate.statusLabel')"
          :options="extensions.topicStatus"
          v-model="topicStatus"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicCreate.stageLabel')"
          :options="extensions.stage"
          v-model="topicStage"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('BcfComponents.BcfTopicCreate.assignedToLabel')"
          :options="extensions.userIdType"
          v-model="topicAssignedTo"
        />
        <div class="m-b-30">
          <BIMDataInput
              margin="0"
            :placeholder="$t('BcfComponents.BcfTopicCreate.dueDateLabel')"
            :error="hasErrorDate"
            :errorMessage="$t('BcfComponents.BcfTopicCreate.dateErrorMessage')"
            v-model="topicDate"
          />
          <div>
            {{ $t("BcfComponents.BcfTopicCreate.dateExample") }}
          </div>
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
          :label="$t('BcfComponents.BcfTopicCreate.labelsLabel')"
          :options="extensions.topicLabel"
          v-model="topicLabels"
        />
      </div>
    </div>


    <div class="bcf-topic-create__footer">
      <BIMDataButton
        :disabled="!topicTitle"
        width="100%"
        color="primary"
        fill
        radius
        @click="submit"
      >
        {{ $t("BcfComponents.BcfTopicCreate.validateButton") }}
      </BIMDataButton>
    </div>

    <div v-if="loading" class="bcf-topic-create__loader">
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
