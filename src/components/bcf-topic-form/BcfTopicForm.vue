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

      <div
        v-if="viewpointsWithSnapshot.length > 0"
        class="bcf-topic-form__content__images"
      >
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

      <div
        v-else
        class="bcf-topic-form__content__upload"
      >
        <span class="icon">
          <BIMDataIcon name="unarchive" fill color="default" size="m" />
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
            @change="upload"
          />
        </BIMDataButton>
      </div>

      <BIMDataButton
        v-if="bcfTopic.viewpoints.length > 0 || viewpoints.length > 0"
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
          @change="upload"
        />
      </BIMDataButton>

      <div class="bcf-topic-form__content__body">
        <BIMDataInput
          :placeholder="$t('BcfComponents.BcfTopicForm.titlePlaceholder')"
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
          v-model="topicPhase"
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
            :error="hasDateError"
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
        <TagsInput v-model="topicTags" class="m-t-24" />
      </div>
    </div>

    <div class="bcf-topic-form__footer">
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        @click="updateBcfTopic"
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
import { isArray, isDate, isObject, snakeCase, transform } from "lodash";
import { useBcf } from "../../composables/bcf.js";
import { formatToDateObject, regexDate, formatDate } from "../../utils/date.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataSafeZoneModal from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSafeZoneModal.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSelect.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import TagsInput from "../tags-input/TagsInput.vue";


export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataLoading,
    BIMDataSafeZoneModal,
    BIMDataSelect,
    BIMDataTextarea,
    BIMDataTextbox,
    TagsInput
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
  emits: ["close", "update-bcf-topic"],
  setup(props, { emit }) {
    // TODO: could be provided by parent ?
    const { updateTopic, deleteViewpoint } = useBcf();

    const viewpointsWithSnapshot = computed(() => {
      return props.bcfTopic.viewpoints.filter(viewpoint =>
        Boolean(viewpoint.snapshot)
      );
    });

    const topicTitle = ref("");
    const topicType = ref("");
    const topicPriority = ref("");
    const topicStatus = ref("");
    const topicPhase = ref("");
    const topicAssignedTo = ref("");
    const topicDate = ref("");
    const topicDescription = ref("");
    const topicTags = ref([]);
    const hasDateError = ref(false);
    const viewpointsToDelete = ref([]);

    const viewpoints = ref(props.bcfTopic.viewpoints);
    const upload = event => {
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
      viewpointsToDelete.value.push(viewpoint);
      const index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
    };

    watch(
      () => props.bcfTopic,
      topic => {
        topicTitle.value = topic.title;
        topicType.value = topic.topicType || null;
        topicPriority.value = topic.priority || null;
        topicStatus.value = topic.topicStatus || null;
        topicPhase.value = topic.stage || null;
        topicAssignedTo.value = topic.assignedTo || null;
        topicDate.value = topic.dueDate || null;
        topicDescription.value = topic.description || null;
        topicType.value = topic.topicType || null;
        topicTags.value = topic.labels || [];
        viewpoints.value = topic.viewpoints || [];
      },
      { immediate: true }
    );

    const loading = ref(false);

    const snakeify = obj =>
      transform(obj, (acc, value, key, target) => {
        const snakeKey = isArray(target) ? key : snakeCase(key);

        acc[snakeKey] = isObject(value) && !isDate(value) ? snakeify(value) : value;
      });
    
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

    const updateBcfTopic = async () => {
      if (!isDateConform(topicDate.value)) {
        hasDateError.value = true;
        return;
      }
      if (topicTitle.value) {
        loading.value = true;
        const viewpoints_json = viewpoints.value.map(viewpoint => {
          const viewpoint_json = { ...viewpoint };
          if ("snapshot" in viewpoint_json && !viewpoint.snapshot) {
            delete viewpoint_json.snapshot;
          }
          if (viewpoint.snapshot) {
            if (viewpoint_json.snapshot.snapshotData.startsWith("http")) {
              // If the viewpoint is an URL, it's not a new viewpoint and we don't want to update it
              delete viewpoint_json.snapshot;
            }
          }
          return viewpoint_json;
        });

        const body = {
          title: topicTitle.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicPhase.value,
          assignedTo: topicAssignedTo.value,
          description: topicDescription.value,
          labels: topicTags.value,
          viewpoints: viewpoints_json
        };
        if (topicDate.value) {
          body.dueDate = formatDate(topicDate.value);
        }
        if (viewpointsToDelete.value.length > 0) {
          await Promise.all(
            viewpointsToDelete.value.map(viewpoint =>
              deleteViewpoint(props.project, props.bcfTopic, viewpoint)
            )
          );
        }
        await updateTopic(props.project, props.bcfTopic, snakeify(body));
        loading.value = false;
      }
    };

    const openModal = ref(false);
    // const goBack = () => {
    //   if (
    //     topicTitle.value !== props.bcfTopic.title ||
    //     topicType.value !== (props.bcfTopic.topicType || null) ||
    //     topicPriority.value !== (props.bcfTopic.priority || null) ||
    //     topicStatus.value !== (props.bcfTopic.topicStatus || null) ||
    //     topicPhase.value !== (props.bcfTopic.stage || null) ||
    //     topicAssignedTo.value !== (props.bcfTopic.assignedTo || null) ||
    //     topicDescription.value !== (props.bcfTopic.description || "" || null) ||
    //     viewpoints.value !== (props.bcfTopic.viewpoints || [])
    //   ) {
    //     openModal.value = true;
    //   } else {
    //     emit("close");
    //   }
    // };

    return {
      hasDateError,
      loading,
      openModal,
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
      viewpointsWithSnapshot,
      // Methods
      // goBack,
      removeViewpoint,
      updateBcfTopic,
      upload
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicForm.scss"></style>
