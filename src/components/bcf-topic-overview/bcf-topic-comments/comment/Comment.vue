<template>
  <div class="comment">
    <div class="comment__header flex items-center justify-between">
      <div class="comment__header__left flex items-center">
        <UserAvatar
          v-if="authorDetail"
          class="m-r-12"
          style="box-shadow: var(--box-shadow)"
          :user="authorDetail"
          size="27"
          initialsSize="14"
          color="silver-light"
        />
        <span
          v-else
          class="comment__header__left__user flex items-center justify-center m-r-12"
        >
          <BIMDataIcon name="user" size="xxs" fill color="granite" />
        </span>

        <strong>
          {{ comment.author }}
        </strong>
        <span class="color-granite m-x-6">
          •
        </span>
        <strong class="color-granite">
          {{ $d(comment.date, "long") }}
        </strong>
      </div>

      <div class="comment__header__right">
        <div class="comment__header__right__actions flex">
          <template v-if="showMenu">
            <BIMDataButton ghost rounded icon @click="onOpenEdit">
              <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="onOpenDelete">
              <BIMDataIcon name="delete" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="toggleMenu">
              <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </template>
          <template v-if="isEditing">
            <BIMDataButton ghost rounded icon @click="isEditing = false">
              <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="confirmEdit">
              <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </template>
        </div>
        <div
          v-if="isDeleting"
          class="comment__header__right__delete p-x-12"
        >
          <span>
            {{ $t("Supprimer ce commentaire ?") }}
          </span>
          <div class="flex items-center">
            <BIMDataButton class="m-r-6" color="high" fill radius @click="confirmDelete">
              {{ $t("Supprimer") }}
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="isDeleting = false">
              <BIMDataIcon name="close" size="xxs" fill color="primary" />
            </BIMDataButton>
          </div>
        </div>
        <BIMDataButton
          v-if="!showMenu && !isDeleting && !isEditing"
          class="comment__header__right__btn" rounded icon @click="toggleMenu"
        >
          <BIMDataIcon name="ellipsis" size="l" fill color="granite-light" />
        </BIMDataButton>
      </div>
    </div>
    <div class="comment__content">
      <BIMDataTextarea
        :class="{ editing: isEditing }"
        width="100%"
        fitContent
        autofocus
        :resizable="false"
        :readonly="!isEditing"
        rows="1"
        name="comment"
        v-model="commentContent"
      />
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useBcf } from "../../composables/bcf.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";

// TODO: should be imported from DS
import UserAvatar from "../../../user-avatar/UserAvatar.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataLoading,
    BIMDataTextarea,
    UserAvatar,
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    },
    comment: {
      type: Object,
      required: true
    },
  },
  setup(props) {
    const { deleteComment, updateComment } = useBcf();

    const showMenu = ref(false);
    const closeMenu = () => showMenu.value = false;
    const toggleMenu = () => showMenu.value = !showMenu.value;

    const loading = ref(false);
    const commentContent = ref(props.comment.comment);

    const authorDetail = props.users.find(
      projectUser => projectUser.email === props.comment.author
    );

    const isDeleting = ref(false);
    const onOpenDelete = () => {
      isDeleting.value = true;
      closeMenu();
    };
    const confirmDelete = async () => {
      try {
        loading.value = true;
        await deleteComment(
          props.project,
          props.bcfTopic,
          props.comment
        );
        isDeleting.value = false;
      } finally {
        loading.value = false;
      }
    };

    const isEditing = ref(false);
    const onOpenEdit = () => {
      isEditing.value = true;
      closeMenu();
    };
    const confirmEdit = async () => {
      if (props.comment.comment !== commentContent.value) {
        try {
          loading.value = true;
          await updateComment(
            props.project,
            props.bcfTopic,
            props.comment,
            {
              comment: commentContent.value
            }
          );
          isEditing.value = false;
        } finally {
          loading.value = false;
        }
      }
    };

    return {
      // References
      authorDetail,
      commentContent,
      isDeleting,
      isEditing,
      loading,
      showMenu,
      // Methods
      closeMenu,
      confirmDelete,
      confirmEdit,
      onOpenDelete,
      onOpenEdit,
      toggleMenu,
    };
  }
};
</script>

<style scoped lang="scss" src="./Comment.scss"></style>
