<template>
  <BIMDataTable
    class="bcf-topics-table"
    tableLayout="fixed"
    :columns="
      displayedColumns
        .map(col => ({
          ...col,
          label: col.label || $t(`BcfComponents.BcfTopicsTable.headers.${col.id}`)
        }))
    "
    :rows="topics"
    rowKey="guid"
    :paginated="paginated"
    :perPage="perPage"
    :rowHeight="42"
    :selectable="selectable"
    :selection="selection"
    @update:selection="$emit('update:selection', $event)"
  >
    <template #cell-index="{ row: topic }">
      <BcfTopicIndexCell
        :detailedExtensions="detailedExtensions"
        :topic="topic"
      />
    </template>
    <template #cell-priority="{ row: topic }">
      <BcfTopicPriorityCell
        :detailedExtensions="detailedExtensions"
        :topic="topic"
      />
    </template>
    <template #cell-status="{ row: topic }">
      <BcfTopicStatusCell
        v-if="topic.topic_status"
        :detailedExtensions="detailedExtensions"
        :topic="topic"
      />
    </template>
    <template #cell-title="{ row: topic }">
      <BIMDataTextbox maxWidth="100%" :text="topic.title" />
    </template>
    <template #cell-creator="{ row: { creator, creation_author } }">
      <BIMDataTooltip :text="creation_author">
        <UserAvatar
          :user="creator || {}"
          :size="30"
          color="silver-light"
          style="margin: auto"
        />
      </BIMDataTooltip>
    </template>
    <template #cell-date="{ row: topic }">
      <div class="bcf-topics-table__date">
        {{ toShortDateFormat(topic.creation_date) }}
        <div class="bcf-topics-table__warning" v-if="warningCallback(topic)">
          <div class="bcf-topics-table__warning__white-gradient"></div>
          <BIMDataTooltip :message="warningTooltipMessage" position="left" >
            <div class="bcf-topics-table__warning__icon">
              <BIMDataIconWarning fill color="warning" />
            </div>
          </BIMDataTooltip>
        </div>
      </div>
    </template>
    <template #cell-actions="{ row: topic }">
      <BcfTopicActionsCell :topic="topic" @open-topic="$emit('open-topic', $event)" :warning="warningCallback(topic)" />
    </template>
  </BIMDataTable>
</template>

<script>
import { computed } from "vue";
import columnsDef from "./columns.js";
// Components
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
    UserAvatar
  },
  props: {
    detailedExtensions: {
      type: Object,
      required: true
    },
    topics: {
      type: Array,
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
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Map,
      default: () => new Map(),
    },
    warningCallback: {
      type: Function,
      default: () => false
    },
    warningTooltipMessage: {
      type: String,
      default: ""
    }
  },
  emits: [
    "open-topic",
    "update:selection",
  ],
  setup(props) {
    const displayedColumns = computed(() =>
      props.columns && props.columns.length > 0
        ? columnsDef.filter(c => props.columns.includes(c.id))
        : columnsDef
    );

    const toShortDateFormat = (date) => {
      if (!date) return "";

      const d = date.toISOString().split('T')[0].split('-').reverse();
      d[2] = d[2].slice(-2);

      return d.join("/");
    };

    return {
      // References
      displayedColumns,
      // Methods
      toShortDateFormat,
    };
  }
};
</script>

<style scoped lang="scss">
.bcf-topics-table {
  &__date {
    height: 42px;
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__warning {
    position: absolute;
    top: 0;
    right: -16px;

    display: flex;
    justify-content: flex-end;
    
    &__white-gradient {      
      background: linear-gradient(90deg, transparent, var(--color-white) 90%);
  
      width: 350px;
      height: 42px;
    }

    &__icon {
      box-shadow: var(--box-shadow);

      display: flex;
      justify-content: center;
      align-items: center;

      width: 42px;
      height: 42px;

      background-color: var(--color-white);
    }
  }
}
</style>
