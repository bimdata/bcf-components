<template>
  <div
    class="user-avatar"
    :class="`user-avatar--${user.profile_picture ? 'silver-light' : color}`"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${initialsSize ? initialsSize : +size * 0.382}px`,
    }"
  >
    <template v-if="user.profile_picture">
      <img :src="user.profile_picture" />
    </template>
    <template v-else-if="initials">
      {{ initials }}
    </template>
    <template v-else>
      <BIMDataIconUser size="xs" />
    </template>
  </div>
</template>

<script>
import { computed } from "vue";

import BIMDataIconUser from "@bimdata/design-system/src/BIMDataComponents/BIMDataIcon/BIMDataIconStandalone/BIMDataIconUser.vue";

export default {
  components: {
    BIMDataIconUser,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 32,
      validate: (value) => value >= 32,
    },
    initialsSize: {
      type: [Number, String],
    },
    color: {
      type: String,
      default: "primary",
      validate: (value) => ["primary", "secondary", "silver-light"].includes(value),
    },
  },
  setup(props) {
    const initials = computed(() =>
      (
        `${(props.user.firstname && props.user.firstname[0]) || ""}` +
        `${(props.user.lastname && props.user.lastname[0]) || ""}`
      ).toUpperCase()
    );

    return {
      initials,
    };
  },
};
</script>

<style scoped lang="scss" src="./UserAvatar.scss"></style>
