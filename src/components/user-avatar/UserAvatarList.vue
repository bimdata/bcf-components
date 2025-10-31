<template>
  <div
    class="user-avatar-list"
    :style="{
      width: `${listWidth}px`,
      gridTemplateColumns: `repeat(${listLength}, ${itemGap}px)`
    }"
  >
    <UserAvatar
      class="user-avatar-list__item"
      v-for="user of displayedUsers"
      :key="user.id"
      :user="user"
      :size="itemSize"
    />
    <template v-if="users.length > length">
      <div
        class="user-avatar-list__tail-item"
        :style="{ width: `${itemSize}px`, height: `${itemSize}px` }"
      >
        {{ `+ ${users.length - length + 1}` }}
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
// Components
import UserAvatar from "./UserAvatar.vue";

export default {
  components: {
    UserAvatar
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    length: {
      type: Number,
      default: 4
    },
    itemSize: {
      type: [Number, String],
      default: 32,
      validate: value => value >= 32
    },
    itemGap: {
      type: [Number, String],
      default: 24,
      validate: value => value > 0
    },
    fixedWidth: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const displayedUsers = computed(() => {
      const n = props.users.length;
      const l = props.length;
      return props.users.slice(0, n > l ? l - 1 : l);
    });

    const listLength = computed(() => {
      const n = props.users.length;
      const l = props.length;
      return props.fixedWidth || n > l ? l : n;
    });

    const listWidth = computed(() => {
      const l = listLength.value;
      const w = +props.itemSize;
      const g = +props.itemGap;
      return l * g + (w > g ? w - g : 0);
    });

    return {
      // References
      displayedUsers,
      listLength,
      listWidth
    };
  }
};
</script>

<style scoped>
.user-avatar-list {
  display: grid;

  .user-avatar-list__item {
    border: 1px solid var(--color-white);
  }

  .user-avatar-list__tail-item {
    min-width: 32px;
    min-height: 32px;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-white);
    border-radius: 50%;
    font-weight: bold;
    background-color: var(--color-primary);
    color: var(--color-silver-light);
    z-index: 1;
  }
}
</style>
