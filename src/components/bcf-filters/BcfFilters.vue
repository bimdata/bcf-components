<template>
  <div class="bcf-filters" v-click-away="close">
    <BIMDataButton
      class="bcf-filters__btn-toggle"
      :disabled="bcfTopics.length === 0"
      width="120px"
      fill
      square
      icon
      @click="toggle"
    >
      <BIMDataIcon
        name="filter"
        size="xxs"
        fill
        color="default"
        margin="0 6px 0 0"
      />
      <span>
        {{ $t("BcfComponents.BcfFilters.filtersButton") }}
      </span>
    </BIMDataButton>

    <transition name="slide-fade-up">
      <div class="bcf-filters__container" v-show="isOpen">
        <div class="bcf-filters__container__header">
          <div class="bcf-filters__container__header__title">
            {{ $t("BcfComponents.BcfFilters.filtersTitle") }}
          </div>
          <BIMDataButton color="primary" ghost rounded icon>
            <BIMDataIcon
              name="close"
              size="xxs"
              fill
              color="primary"
              @click="close"
            />
          </BIMDataButton>
        </div>

        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfComponents.BcfFilters.priorityLabel')"
          :nullLabel="$t('BcfComponents.BcfFilters.undefined')"
          :options="priorityOptions"
          v-model="filters.priorities"
        />

        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfComponents.BcfFilters.statusLabel')"
          :nullLabel="$t('BcfComponents.BcfFilters.undefined')"
          :options="statusOptions"
          v-model="filters.statuses"
        />

        <div class="bcf-filters__container__date">
          <div>
            <BIMDataInput
              margin="0"
              :placeholder="$t('BcfComponents.BcfFilters.startDatePlaceholder')"
              :error="hasErrorStartDate"
              :errorMessage="$t('BcfComponents.BcfFilters.startDateError')"
              v-model="filters.startDate"
            />
            <p class="example">
              {{ $t("BcfComponents.BcfFilters.startDateExample") }}
            </p>
          </div>
          <div>
            <BIMDataInput
              margin="0"
              :placeholder="$t('BcfComponents.BcfFilters.endDatePlaceholder')"
              :error="hasErrorEndDate"
              :errorMessage="$t('BcfComponents.BcfFilters.endDateError')"
              v-model="filters.endDate"
            />
            <p class="example">
              {{ $t("BcfComponents.BcfFilters.endDateExample") }}
            </p>
          </div>
        </div>

        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfComponents.BcfFilters.assignedToLabel')"
          :nullLabel="$t('BcfComponents.BcfFilters.undefined')"
          :options="userOptions"
          v-model="filters.users"
        />

        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfComponents.BcfFilters.creatorsLabel')"
          :nullLabel="$t('BcfComponents.BcfFilters.undefined')"
          :options="creatorOptions"
          v-model="filters.creators"
        />

        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfComponents.BcfFilters.tagsLabel')"
          :nullLabel="$t('BcfComponents.BcfFilters.undefined')"
          :options="labelOptions"
          v-model="filters.labels"
        />

        <div class="bcf-filters__container__actions">
          <BIMDataButton
            class="m-r-12"
            color="primary"
            ghost
            radius
            @click="resetFilters"
          >
            {{ $t("BcfComponents.BcfFilters.resetButton") }}
          </BIMDataButton>
          <BIMDataButton color="primary" fill radius @click="submitFilters">
            <BIMDataIcon
              name="search"
              size="xxs"
              fill
              color="default"
              margin="0 6px 0 0"
            />
            <span>
              {{ $t("BcfComponents.BcfFilters.searchButton") }}
            </span>
          </BIMDataButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref, toRaw } from "vue";
import { useBcfFilter } from "../../composables/filter.js";
import { dateRegex } from "../../utils/date.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataInput.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSelect.js";

function getSelectOptions(list) {
  return Array.from(new Set(list))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataSelect,
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  emits: [
    "submit"
  ],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const close = () => isOpen.value = false;
    const toggle = () => isOpen.value = !isOpen.value;

    const hasErrorStartDate = ref(false);
    const hasErrorEndDate = ref(false);

    const { filters, filteredTopics, reset } = useBcfFilter(
      computed(() => props.bcfTopics)
    );

    const priorityOptions = computed(
      () => getSelectOptions(props.bcfTopics.map(topic => topic.priority))
    );

    const statusOptions = computed(
      () => getSelectOptions(props.bcfTopics.map(topic => topic.topic_status))
    );

    const userOptions = computed(
      () => getSelectOptions(props.bcfTopics.map(topic => topic.assigned_to))
    );

    const creatorOptions = computed(
      () => getSelectOptions(props.bcfTopics.map(topic => topic.creation_author))
    );

    const labelOptions = computed(
      () => getSelectOptions(props.bcfTopics.flatMap(topic => topic.labels))
    );

    const submitFilters = () => {
      if (filters.startDate && filters.endDate) {
        if (
          !filters.startDate.match(dateRegex) ||
          filters.startDate > deserialize(new Date())
        ) {
          hasErrorStartDate.value = true;
          return;
        }
        if (
          !filters.endDate.match(dateRegex) ||
          filters.endDate < filters.startDate
        ) {
          hasErrorEndDate.value = true;
          return;
        }
      }

      emit("submit", {
        filters: toRaw(filters),
        topics: filteredTopics.value
      });
      isOpen.value = false;
    };

    const resetFilters = () => {
      hasErrorStartDate.value = false;
      hasErrorEndDate.value = false;
      reset();
      emit("submit", {
        filters: toRaw(filters),
        topics: filteredTopics.value
      });
    };

    return {
      // References
      creatorOptions,
      filters,
      hasErrorEndDate,
      hasErrorStartDate,
      isOpen,
      priorityOptions,
      statusOptions,
      labelOptions,
      userOptions,
      // Methods
      close,
      resetFilters,
      submitFilters,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfFilters.scss"></style>
