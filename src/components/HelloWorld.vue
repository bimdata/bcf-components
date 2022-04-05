<template>
  <div class="hello-world">
    <input v-model="text" />
    <span>{{ message }}</span>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";

export default {
  props: {
    name: String,
  },
  setup(props) {
    const text = ref("World");
    const message = computed(() => `Hello ${text.value} !`);

    return {
      text,
      message
    };
  },
};
</script>

<style scoped lang="scss" src="./HelloWorld.scss"></style>
