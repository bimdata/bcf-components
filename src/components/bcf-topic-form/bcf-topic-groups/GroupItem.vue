<template>
  <div class="group-item">
    <BIMDataCheckbox v-model="checked" />
    <div class="card">
      <div class="stripe" :style="{ backgroundColor: group.color }"></div>
      <BIMDataIconGroup />
      <BIMDataTextbox class="name" cut-position="end" :text="group.name" />
      <UserAvatarList :users="group.members" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import UserAvatarList from "../../user-avatar/UserAvatarList.vue";

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);

const checked = ref(props.selected);

watch(checked, () => emit("toggle", props.group));
</script>

<style scoped>
.group-item {
  min-height: 50px;
  padding-right: 6px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-unit);

  .card {
    position: relative;
    height: 100%;
    flex: 1;
    padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
    box-shadow: var(--box-shadow);

    display: flex;
    align-items: center;
    gap: var(--spacing-unit);

    .stripe {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 6px;
    }

    .name {
      width: 0 !important;
      flex: 1;
    }
  }
}
</style>
