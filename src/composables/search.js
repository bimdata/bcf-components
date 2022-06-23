import { ref, watch } from "vue";

const searchFields = [
  "title",
  "topic_type",
  "priority",
  "topic_status",
  "stage",
  "creation_author",
  "modified_author",
  "assigned_to",
  "description",
];

function useBcfSearch(topics) {
  const searchText = ref("");
  const filteredTopics = ref([]);

  watch(
    [topics, searchText],
    () => {
      if (searchText.value) {
        const lowerCaseSearchText = searchText.value.toLowerCase();
        filteredTopics.value = topics.value.filter(topic =>
          searchFields.some(field =>
            (topic[field] || "").toLowerCase().includes(lowerCaseSearchText)
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
