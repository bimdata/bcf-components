<template>
  <BIMDataTable
    class="bcf-topics-table"
    :columns="displayedColumns"
    :rows="bcfTopics"
    rowKey="guid"
    :paginated="paginated"
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
    <template #cell-creator="{ row: { creator, creationAuthor } }">
      <template v-if="creator">
        <UserAvatar :user="creator" :size="30" style="margin: auto" />
      </template>
      <template v-else>
        <BIMDataTextbox maxWidth="120px" :text="creationAuthor" />
      </template>
    </template>
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
import { computed } from "@vue/composition-api";
import columnsDef from "./columns.js";
// Components
import BIMDataTable from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTable.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicActionsCell from "./bcf-topic-actions-cell/BcfTopicActionsCell.vue";
import BcfTopicPriorityCell from "./bcf-topic-priority-cell/BcfTopicPriorityCell.vue";
import BcfTopicStatusCell from "./bcf-topic-status-cell/BcfTopicStatusCell.vue";
import UserAvatar from "../user-avatar/UserAvatar.vue";

export default {
  components: {
    BcfTopicActionsCell,
    BcfTopicPriorityCell,
    BcfTopicStatusCell,
    BIMDataTable,
    BIMDataTextbox,
    UserAvatar
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
    paginated: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 10
    },
    columns: {
      type: Array
    }
  },
  emits: [
    "open-bcf-topic"
  ],
  setup(props) {
    const displayedColumns = computed(() =>
      props.columns && props.columns.length > 0
        ? columnsDef.filter(c => props.columns.includes(c.id))
        : columnsDef
    );

    return {
      displayedColumns
    };
  }
};
</script>
