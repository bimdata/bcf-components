<template>
  <div>
    <BIMDataTable
      class="bcf-topics-list"
      :columns="columns"
      :rows="bcfTopics"
      rowKey="id"
      :paginated="true"
      :perPage="14"
      :rowHeight="44"
      @selection-changed="$emit('selection-changed', $event)"
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
      <template #cell-creator="{ row: { creationAuthor } }">
        {{ creationAuthor }}
      </template>
      <template #cell-date="{ row: bcfTopic }">
        {{ $d(bcfTopic.creationDate, "long") }}
      </template>
      <template #cell-actions="{ row: bcfTopic }">
        <BcfTopicActionsCell :bcfTopic="bcfTopic" />
      </template>
    </BIMDataTable>
  </div>
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
    }
  },
  setup() {
    const columns = ref(columnsDef);

    return {
      columns
    };
  }
};
</script>
