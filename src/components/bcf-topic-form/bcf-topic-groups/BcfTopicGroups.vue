<template>
  <div class="bcf-topic-groups" @click="isOpenGroups = true">
    <span class="label">
      <template v-if="groups.length > 0">
        {{ $t("BcfComponents.BcfTopicForm.groupsCount", { count: groups.length }) }}
      </template>
      <template v-else>
        {{ $t("BcfComponents.BcfTopicForm.groupsLabel") }}
      </template>
    </span>
    <BIMDataIconChevron size="xxs" />
    <div class="underline"></div>
  </div>

  <div v-if="isOpenGroups" class="bcf-topic-groups__selector">
    <BIMDataButton ghost radius @click="isOpenGroups = false">
      <BIMDataIconArrow size="xxs" />
      <span class="m-l-6">{{ "BcfComponents.back" }}</span>
    </BIMDataButton>
    <div class="body">
      <div class="text">
        {{ $t("BcfComponents.BcfTopicForm.groupsText") }}
      </div>
      <div class="list">
        <GroupItem
          v-for="group in projectGroups"
          :key="group.id"
          :group="group"
          :selected="topicGroups.includes(group.id)"
          @toggle="toggleGroup"
        />
      </div>
    </div>
    <BIMDataButton
      width="100%"
      color="primary"
      fill
      radius
      @click="isOpenGroups = false, $emit('selection-change', topicGroups)"
    >
      {{ $t("BcfComponents.BcfTopicForm.validate") }}
    </BIMDataButton>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import service from "../../../service.js";
import GroupItem from "./GroupItem.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  }
});

defineEmits(["selection-change"]);

const isOpenGroups = ref(false);
const projectGroups = ref([]);
const selectedGroups = ref([]);

const topicGroups = computed(
  () => selectedGroups.value.map(group => group.id)
);

const toggleGroup = group => {
  const index = selectedGroups.value.findIndex(g => g.id === group.id);
  if (index !== -1) {
    selectedGroups.value.splice(index, 1);
  } else {
    selectedGroups.value.push(group);
  }
};

onMounted(async () => {
  projectGroups.value = await service.fetchProjectGroups(props.project);
  selectedGroups.value = projectGroups.value.filter(group => props.groups.includes(group.id));
});
</script>

<style scoped>
.bcf-topic-groups {
  position: relative;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .label {
    font-size: 12px;
    color: var(--color-granite-light);
  }

  .underline {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    display: block;
    background: var(--color-silver);
  }
}

.bcf-topic-groups__selector {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--spacing-unit);
  background-color: var(--color-white);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-unit);

  .body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .text {
      text-align: center;
      color: var(--color-granite);
    }

    .list {
      margin-top: var(--spacing-unit);
      padding: var(--spacing-unit) 0;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-unit);
    }
  }
}
</style>
