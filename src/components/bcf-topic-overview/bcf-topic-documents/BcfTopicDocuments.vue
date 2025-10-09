<template>
  <div class="bcf-topic-documents">
    <div
      class="bcf-topic-documents__item"
      v-for="doc in documents"
      :key="doc.guid"
      @click="$emit('view-topic-document', doc)"
    >
      <BIMDataFileIcon :size="22" :file-name="doc.referenced_document" />
      <span>{{ doc.referenced_document }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import service from "../../../service.js";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  topic: {
    type: Object,
    required: true,
  },
});

defineEmits(["view-topic-document"]);

const documents = computed(() => props.topic.documents ?? []);

watch(
  () => props.topic,
  async () => {
    if (!props.topic.documents) {
      // Load topic documents if they are not loaded yet
      props.topic.documents = await service.fetchTopicDocuments(props.project, props.topic);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.bcf-topic-documents {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-unit);
}

.bcf-topic-documents__item {
  padding: calc(var(--spacing-unit) / 2) var(--spacing-unit);
  border-radius: 3px;
  background-color: var(--color-silver-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-unit);
  font-weight: bold;
  cursor: pointer;
}
</style>
