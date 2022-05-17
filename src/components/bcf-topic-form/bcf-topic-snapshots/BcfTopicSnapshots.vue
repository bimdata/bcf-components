<template>
  <div class="bcf-topic-snapshots">
    <template v-if="viewpoints.length > 0">
      <div class="bcf-topic-snapshots__snapshots">
        <div
          class="snapshot-preview"
          :class="{ single: viewpoints.length === 1 }"
          v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
          :key="viewpoint.guid || i"
        >
          <img
            v-if="viewpoint.snapshot.snapshotData"
            :src="viewpoint.snapshot.snapshotData"
          />
          <BIMDataButton
            class="btn-delete"
            fill
            rounded
            icon
            @click="delImage(viewpoint)"
          >
            <BIMDataIcon name="delete" size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bcf-topic-snapshots__create" @click="addSnapshot">
        <BIMDataIcon name="camera" size="l" />
      </div>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
  },
  props: {
    bcfTopic: {
      type: Object
    },
  },
  emits: [
    "add-snapshot",
    "del-snapshot"
  ],
  setup(props, { emit }) {
    const viewpoints = ref([]);

    watch(
      () => props.bcfTopic,
      topic => {
        viewpoints.value =
          (topic?.viewpoints || []).filter(v => v.snapshot);
      },
      { immediate: true }
    );

    const addSnapshot = () => {
      emit("add-snapshot");
    };

    const delSnapshot = () => {
      emit("del-snapshot");
    };

    return {
      // References
      viewpoints,
      // Methods
      addSnapshot,
      delSnapshot,
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicSnapshots.scss"></style>
