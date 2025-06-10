import { computed, reactive } from "vue";

const EMPTY_FILTERS = {
  priorities: [],
  statuses: [],
  stages: [],
  users: [],
  creators: [],
  labels: [],
  startDate: null,
  endDate: null,
};

function useBcfFilter(topics) {
  const filters = reactive({ ...EMPTY_FILTERS });

  const filteredTopics = computed(() => {
    let list = topics.value;
    if (filters.priorities.length > 0) {
      list = list.filter(t => filters.priorities.includes(t.priority));
    }
    if (filters.statuses.length > 0) {
      list = list.filter(t => filters.statuses.includes(t.topic_status));
    }
    if (filters.stages.length > 0) {
      list = list.filter(t => filters.stages.includes(t.stage));
    }
    if (filters.users.length > 0) {
      list = list.filter(t => filters.users.includes(t.assigned_to));
    }
    if (filters.creators.length > 0) {
      list = list.filter(t => filters.creators.includes(t.creation_author));
    }
    if (filters.labels.length > 0) {
      list = list.filter(t => filters.labels.some(l => t.labels.includes(l)));
    }
    if (filters.startDate && filters.endDate) {
      list = list.filter(t => (
        t.creation_date >= filters.startDate &&
        t.creation_date <= filters.endDate
      ));
    }
    return list;
  });

  function apply(f) {
    Object.assign(filters, f);
  }

  function reset() {
    apply(EMPTY_FILTERS);
  }

  return {
    filters,
    filteredTopics,
    apply,
    reset,
  };
}

export { useBcfFilter };
