<template>
  <div>
    <img :src="topic.snapshot.snapshot_data" />
  </div>
</template>

<script>
export default {
  props: {
    topic: {
      type: Object,
    },
  },
};
</script>
