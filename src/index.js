import * as config from "./config.js";
import service from "./service.js";
import { getPriorityColor, getStatusColor } from "./utils/topic.js";
import { getViewpointConfig } from "./utils/viewpoints.js";

import { useBcfFilter } from "./composables/filter.js";
import { useBcfSearch } from "./composables/search.js";
import { useBcfSort } from "./composables/sort.js";

import BcfFilters from "./components/bcf-filters/BcfFilters.vue";
import BcfSettings from "./components/bcf-settings/BcfSettings.vue";
import BcfStatistics from "./components/bcf-statistics/BcfStatistics.vue";
import BcfTopicCard from "./components/bcf-topic-card/BcfTopicCard.vue";
import BcfTopicCreationCard from "./components/bcf-topic-creation-card/BcfTopicCreationCard.vue";
import BcfTopicForm from "./components/bcf-topic-form/BcfTopicForm.vue";
import BcfTopicOverview from "./components/bcf-topic-overview/BcfTopicOverview.vue";
import BcfTopicsTable from "./components/bcf-topics-table/BcfTopicsTable.vue";

const components = {
  BcfFilters,
  BcfSettings,
  BcfStatistics,
  BcfTopicCard,
  BcfTopicCreationCard,
  BcfTopicForm,
  BcfTopicOverview,
  BcfTopicsTable,
};

export {
  config,
  service,
  getPriorityColor,
  getStatusColor,
  getViewpointConfig,
  useBcfFilter,
  useBcfSearch,
  useBcfSort,
  components,

  // Export components individually
  BcfFilters,
  BcfSettings,
  BcfStatistics,
  BcfTopicCard,
  BcfTopicCreationCard,
  BcfTopicForm,
  BcfTopicOverview,
  BcfTopicsTable,
};
