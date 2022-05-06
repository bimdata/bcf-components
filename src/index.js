import { setApiClient } from "./api-client.js";

import BcfFilters from "./components/bcf-filters/BcfFilters.vue";
import BcfSettings from "./components/bcf-settings/BcfSettings.vue";
import BcfStatistics from "./components/bcf-statistics/BcfStatistics.vue";
import BcfTopicCard from "./components/bcf-topic-card/BcfTopicCard.vue";
import BcfTopicCreate from "./components/bcf-topic-create/BcfTopicCreate.vue";
import BcfTopicCreationCard from "./components/bcf-topic-creation-card/BcfTopicCreationCard.vue";
import BcfTopicForm from "./components/bcf-topic-form/BcfTopicForm.vue";
import BcfTopicOverview from "./components/bcf-topic-overview/BcfTopicOverview.vue";
import BcfTopicsTable from "./components/bcf-topics-table/BcfTopicsTable.vue";

const components = {
  BcfFilters,
  BcfSettings,
  BcfStatistics,
  BcfTopicCard,
  BcfTopicCreate,
  BcfTopicCreationCard,
  BcfTopicForm,
  BcfTopicOverview,
  BcfTopicsTable,
};

export {
  setApiClient,
  components,

  // Export components individually
  BcfFilters,
  BcfSettings,
  BcfStatistics,
  BcfTopicCard,
  BcfTopicCreate,
  BcfTopicCreationCard,
  BcfTopicForm,
  BcfTopicOverview,
  BcfTopicsTable,
};
