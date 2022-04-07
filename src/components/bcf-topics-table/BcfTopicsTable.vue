<template>
  <div>
    <BIMDataTable
      class="bcf-topics-list"
      :columns="columns"
      :rows="bcfTopics"
      rowKey="id"
      :paginated="true"
      :perPage="13"
      :rowHeight="44"
      @selection-changed="$emit('selection-changed', $event)"
    >
      <template #cell-priority="{ row: bcfTopic }">
        <BcfTopicPriorityCell :bcfTopic="bcfTopic" />
      </template>
      <template #cell-title="{ row: bcfTopic }">
        <BIMDataTextbox maxWidth="500px" :text="bcfTopic.title" />
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
import { ref, watch } from "@vue/composition-api";
import columnsDef from "./columns.js";
// Components
import BIMDataTable from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTable.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import BcfTopicActionsCell from "./bcf-topic-actions-cell/BcfTopicActionsCell.vue";
import BcfTopicPriorityCell from "./bcf-topic-priority-cell/BcfTopicPriorityCell.vue";

// TODO: handle this
import { useI18n } from "vue-i18n";

export default {
  components: {
    BcfTopicActionsCell,
    BcfTopicPriorityCell,
    BIMDataTable,
    BIMDataTextbox,
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { locale, t } = useI18n();

    const columns = ref([]);
    watch(
      () => locale.value,
      () => {
        columns.value = columnsDef.map(col => ({
          ...col,
          label: col.label || t(`BcfTopicsList.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );

    return {
      columns
    };
  }
};
</script>
