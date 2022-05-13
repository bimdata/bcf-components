<template>
  <BIMDataTable
    class="bcf-topics-table"
    :columns="columns"
    :rows="bcfTopics"
    rowKey="guid"
    :paginated="true"
    :perPage="perPage"
    :rowHeight="42"
  >
    <template #cell-index="{ row: bcfTopic }">
      {{ bcfTopic.index }}
    </template>
    <template #cell-priority="{ row: bcfTopic }">
      <BcfTopicPriorityCell
        :bcfTopic="bcfTopic"
        :detailedExtensions="detailedExtensions"
      />
    </template>
    <template #cell-status="{ row: bcfTopic }">
      <BcfTopicStatusCell
        v-if="bcfTopic.topicStatus"
        :bcfTopic="bcfTopic"
        :detailedExtensions="detailedExtensions"
      />
    </template>
    <template #cell-title="{ row: bcfTopic }">
      <BIMDataTextbox maxWidth="100%" :text="bcfTopic.title" />
    </template>
    <!-- <template #cell-creator="{ row: { creationAuthor } }">
      {{ creationAuthor }}
    </template> -->
    <template #cell-date="{ row: bcfTopic }">
      {{ $d(bcfTopic.creationDate, "short") }}
    </template>
    <template #cell-actions="{ row: bcfTopic }">
      <BcfTopicActionsCell
        :bcfTopic="bcfTopic"
        @open-bcf-topic="$emit('open-bcf-topic', $event)"
      />
    </template>
  </BIMDataTable>
</template>

<script>
import { ref } from "@vue/composition-api";
import columnsDef from "./columns.js";
// Components
import BIMDataTable from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTable.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicActionsCell from "./bcf-topic-actions-cell/BcfTopicActionsCell.vue";
import BcfTopicPriorityCell from "./bcf-topic-priority-cell/BcfTopicPriorityCell.vue";
import BcfTopicStatusCell from "./bcf-topic-status-cell/BcfTopicStatusCell.vue";

export default {
  components: {
    BcfTopicActionsCell,
    BcfTopicPriorityCell,
    BcfTopicStatusCell,
    BIMDataTable,
    BIMDataTextbox,
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    },
    perPage: {
      type: Number,
      default: 14
    },
  },
  emits: [
    "open-bcf-topic"
  ],
  setup() {
    const columns = ref(columnsDef);

    return {
      columns
    };
  }
};
</script>
