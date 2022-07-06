import { ref } from "vue";

function useListSort(list, mapper = elem => elem) {
  const initialList = ref(list);

  const sort = (order = "asc") => {
    const sortedList = initialList.value
      .slice()
      .sort((a, b) => (mapper(a) < mapper(b) ? -1 : 1));
    if (order === "desc") {
      sortedList.reverse();
    }
    initialList.value = sortedList;
  };

  const sortOrder = ref("none");
  const sortToggle = () => {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    sort(sortOrder.value);
  };

  return {
    sortOrder,
    sortToggle
  };
}

function useBcfSort(topics) {
  const { sortToggle: sortToggleIndex, sortOrder: sortOrderIndex } =
    useListSort(topics, topic => topic.index);

  const { sortToggle: sortToggleTitle, sortOrder: sortOrderTitle } =
    useListSort(topics, topic => topic.title);

  const { sortToggle: sortToggleDate, sortOrder: sortOrderDate } =
    useListSort(topics, topic => topic.creation_date);

  const sortedBy = ref("");

  const sortByIndex = () => {
    sortedBy.value = "index";
    sortToggleIndex();
  };
  const sortByTitle = () => {
    sortedBy.value = "title";
    sortToggleTitle();
  };
  const sortByDate = () => {
    sortedBy.value = "date";
    sortToggleDate();
  };

  return {
    sortedBy,
    sortByIndex,
    sortByTitle,
    sortByDate,
    sortOrderIndex,
    sortOrderTitle,
    sortOrderDate,
  };
}

export { useBcfSort };
