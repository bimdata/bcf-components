<template>
  <div>
    <img :src="topic.snapshot.snapshot_data" />
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  props: {
    topic: {
      type: Object,
    },
  },
  setup(props) {
    inject("$viewer");
  },
};
</script>
