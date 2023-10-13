<template>
  <div class="bcf-filters" v-click-away="close">
    <BIMDataButton
      class="bcf-filters__btn-toggle"
      :disabled="topics.length === 0"
      width="120px"
      fill
      square
      icon
      @click="toggle"
    >
      <BIMDataIconFilterList size="xxs" fill color="default" margin="0 6px 0 0" />
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
          <BIMDataButton color="primary" ghost rounded icon @click="close">
            <BIMDataIconClose size="xxs" fill color="primary" />
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
          <BIMDataDatePicker
            v-model="filters.startDate"
            :value="filters.startDate"
            @to-date-change="filters.endDate = $event"
            :toDate="filters.endDate"
            :clearButton="true"
            width="100%"
            :placeholder="$t('BcfComponents.BcfFilters.datePlaceholder')"
            :isDateRange="true"
            :autoCloseRange="true"
          >
          </BIMDataDatePicker>
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
        >
          <template #empty>
            <div class="p-x-12 p-t-12 p-b-6">
              <BIMDataText fontSize="13px">
                {{ $t("BcfComponents.BcfFilters.undefined") }}
              </BIMDataText>
            </div>
          </template>
        </BIMDataSelect>

        <div class="bcf-filters__container__actions">
          <BIMDataButton class="m-r-12" color="primary" ghost radius @click="resetFilters">
            {{ $t("BcfComponents.BcfFilters.resetButton") }}
          </BIMDataButton>
          <BIMDataButton color="primary" fill radius @click="submitFilters">
            <BIMDataIconSearch size="xxs" margin="0 6px 0 0" />
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
import { computed, ref, toRaw, watch } from "vue";
import { useBcfFilter } from "../../composables/filter.js";
// Components
import BIMDataButton from "@bimdata/design-system/src/BIMDataComponents/BIMDataButton/BIMDataButton.vue";
import {
  BIMDataIconClose,
  BIMDataIconFilterList,
  BIMDataIconSearch,
} from "@bimdata/design-system/src/BIMDataComponents/BIMDataIcon/BIMDataIconStandalone/index.js";
import BIMDataInput from "@bimdata/design-system/src/BIMDataComponents/BIMDataInput/BIMDataInput.vue";
import BIMDataSelect from "@bimdata/design-system/src/BIMDataComponents/BIMDataSelect/BIMDataSelect.vue";
import BIMDataText from "@bimdata/design-system/src/BIMDataComponents/BIMDataText/BIMDataText.vue";

function getSelectOptions(list) {
  return Array.from(new Set(list)).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export default {
  components: {
    BIMDataButton,
    BIMDataIconClose,
    BIMDataIconFilterList,
    BIMDataIconSearch,
    BIMDataInput,
    BIMDataSelect,
    BIMDataText
  },
  props: {
    topics: {
      type: Array,
      required: true,
    },
    initFilters: {
      type: Object,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const close = () => (isOpen.value = false);
    const toggle = () => (isOpen.value = !isOpen.value);

    const { filters, filteredTopics, reset, apply } = useBcfFilter(computed(() => props.topics));

    watch(
      () => props.initFilters,
      () => {
        if (props.initFilters) {
          apply(props.initFilters);
        } else {
          filters;
        }
      },
      { deep: true }
    );

    const priorityOptions = computed(() =>
      getSelectOptions(props.topics.map((topic) => topic.priority))
    );

    const statusOptions = computed(() =>
      getSelectOptions(props.topics.map((topic) => topic.topic_status))
    );

    const userOptions = computed(() =>
      getSelectOptions(props.topics.map((topic) => topic.assigned_to))
    );

    const creatorOptions = computed(() =>
      getSelectOptions(props.topics.map((topic) => topic.creation_author))
    );

    const labelOptions = computed(() =>
      getSelectOptions(props.topics.flatMap((topic) => topic.labels))
    );

    const submitFilters = () => {
      filters.endDate?.setHours(23, 59, 59);
      emit("submit", {
        filters: toRaw(filters),
        topics: filteredTopics.value,
      });
      isOpen.value = false;
    };

    const resetFilters = () => {
      reset();
      emit("submit", {
        filters: toRaw(filters),
        topics: filteredTopics.value,
      });
    };

    return {
      // References
      creatorOptions,
      filters,
      isOpen,
      labelOptions,
      priorityOptions,
      statusOptions,
      userOptions,
      // Methods
      close,
      resetFilters,
      submitFilters,
      toggle,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfFilters.scss"></style>
