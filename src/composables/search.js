import { ref, watch } from "vue";

const searchFields = [
  "title",
  "topicType",
  "priority",
  "topicStatus",
  "stage",
  "creationAuthor",
  "modifiedAuthor",
  "assignedTo",
  "description",
];

function useBcfSearch(topics) {
  const searchText = ref("");
  const filteredTopics = ref([]);

  watch(
    [topics, searchText],
    () => {
      if (searchText.value) {
        const agnosticFilter = searchText.value.toLowerCase();
        filteredTopics.value = topics.value.filter(topic =>
          searchFields.some(field =>
            (topic[field] || "").toLowerCase().includes(agnosticFilter)
          )
        );
      } else {
        filteredTopics.value = topics.value;
      }
    },
    { immediate: true }
  );

  return {
    searchText,
    filteredTopics,
  };
}

export { useBcfSearch };
