<template>
  <div class="group-item">
    <BIMDataCheckbox
      :value="selected" 
      @update:modelValue="$emit('toggle')"
    />
    <div class="card">
      <div class="stripe"></div>
      <BIMDataIconGroup />
      <div class="name">{{ group.name }}</div>
      <div class="users">TODO</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  group: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  }
});

defineEmits(["toggle"]);
</script>

<style scoped>
.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card {
    display: flex;
    align-items: center;

    /* TODO */
  }
}
</style>
