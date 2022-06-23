import { computed, reactive } from "vue";
import { formatToISO } from "../utils/date.js";

const EMPTY_FILTERS = {
  priorities: [],
  statuses: [],
  users: [],
  creators: [],
  labels: [],
  startDate: "",
  endDate: "",
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
        t.creation_date >= new Date(`${formatToISO(filters.startDate)}T00:00`) &&
        t.creation_date <= new Date(`${formatToISO(filters.endDate)}T23:59:59`)
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
