<template>
  <BIMDataTable
    class="bcf-topics-table"
    :columns="
      displayedColumns
        .map(col => ({
          ...col,
          label: col.label || $t(`BcfComponents.BcfTopicsTable.headers.${col.id}`)
        }))
    "
    :rows="bcfTopics"
    rowKey="guid"
    :paginated="paginated"
    :perPage="perPage"
    :rowHeight="42"
  >
    <template #cell-index="{ row: bcfTopic }">
      <BcfTopicIndexCell
        :bcfTopic="bcfTopic"
        :detailedExtensions="detailedExtensions"
      />
    </template>
    <template #cell-priority="{ row: bcfTopic }">
      <BcfTopicPriorityCell
        :bcfTopic="bcfTopic"
        :detailedExtensions="detailedExtensions"
      />
    </template>
    <template #cell-status="{ row: bcfTopic }">
      <BcfTopicStatusCell
        v-if="bcfTopic.topic_status"
        :bcfTopic="bcfTopic"
        :detailedExtensions="detailedExtensions"
      />
    </template>
    <template #cell-title="{ row: bcfTopic }">
      <BIMDataTextbox maxWidth="100%" :text="bcfTopic.title" />
    </template>
    <template #cell-creator="{ row: { creator } }">
      <UserAvatar
        :user="creator || {}"
        :size="30"
        color="silver-light"
        style="margin: auto"
      />
    </template>
    <template #cell-date="{ row: bcfTopic }">
      {{ deserializeShort(bcfTopic.creationDate) }}
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
import { computed } from "vue";
import columnsDef from "./columns.js";
import { deserializeShort } from "../../utils/date.js";
// Components
import BIMDataTable from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTable.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicActionsCell from "./bcf-topic-actions-cell/BcfTopicActionsCell.vue";
import BcfTopicIndexCell from "./bcf-topic-index-cell/BcfTopicIndexCell.vue";
import BcfTopicPriorityCell from "./bcf-topic-priority-cell/BcfTopicPriorityCell.vue";
import BcfTopicStatusCell from "./bcf-topic-status-cell/BcfTopicStatusCell.vue";

// TODO: should be imported from DS
import UserAvatar from "../user-avatar/UserAvatar.vue";

export default {
  components: {
    BcfTopicActionsCell,
    BcfTopicIndexCell,
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
      // References
      displayedColumns,
      // Methods
      deserializeShort,
    };
  }
};
</script>
