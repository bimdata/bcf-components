<template>
  <div class="bcf-topic-documents-selector" @click="isOpenDMS = true">
    <span class="label">
      <template v-if="documents.length > 0">
        {{ $t("BcfComponents.BcfTopicForm.documentsCount", { count: documents.length }) }}
      </template>
      <template v-else>
        {{ $t("BcfComponents.BcfTopicForm.documentsLabel") }}
      </template>
    </span>
    <BIMDataIconChevron size="xxs" />
    <div class="underline"></div>
  </div>

  <div v-if="isOpenDMS" class="bcf-topic-form__dms">
    <BIMDataButton ghost radius @click="isOpenDMS = false">
      <BIMDataIconArrow size="xxs" />
      <span class="m-l-6">{{ "BcfComponents.back" }}</span>
    </BIMDataButton>
    <BIMDataFileManager
      :locale="$i18n.locale"
      :headerButtons="false"
      :apiUrl="apiUrl()"
      :archiveUrl="''"
      :accessToken="accessToken()"
      :spaceId="project.cloud.id"
      :projectId="project.id"
      :select="true"
      :multi="true"
      :init-selection="selectedDocuments"
      @selection-change="selectedDocuments = $event"
    />
    <BIMDataButton
      width="100%"
      color="primary"
      fill
      radius
      @click="isOpenDMS = false, $emit('selection-change', topicDocuments)"
    >
      {{ $t("BcfComponents.BcfTopicForm.validateDocuments") }}
    </BIMDataButton>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import service from "../../../service.js";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  documents: {
    type: Array,
    required: true,
  }
});

defineEmits(["selection-change"]);

const apiUrl = () => service.apiClient.config.configuration.basePath;
const accessToken = () => service.apiClient.accessToken;

const isOpenDMS = ref(false);
const selectedDocuments = ref([]);

const topicDocuments = computed(
  () => selectedDocuments.value.map(({ document }) => ({ guid: document.id }))
);

onMounted(() => {
  selectedDocuments.value = props.documents.map(doc => ({ document: { id: doc.guid } }));
});
</script>

<style scoped>
.bcf-topic-documents-selector {
  position: relative;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .label {
    font-size: 12px;
    color: var(--color-granite-light);
  }

  .underline {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    display: block;
    background: var(--color-silver);
  }
}

.bcf-topic-form__dms:deep() {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--spacing-unit);
  background-color: var(--color-white);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-unit);

  .bimdata-file-manager {
    flex: 1;
    overflow: auto;

    .bimdata-responsive-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
    }

    .file-card {
      height: 150px;

      .file-card__content__footer__name {
        --textbox-lines: 1 !important;

        .multi-line-text-box__content__full,
        .multi-line-text-box__ghost {
          display: block ruby;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .file-card__content__footer__initials {
        display: none;
      }
    }
  }
}
</style>
