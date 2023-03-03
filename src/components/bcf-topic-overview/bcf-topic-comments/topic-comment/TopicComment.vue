<template>
  <div class="topic-comment m-t-18">
    <div class="topic-comment__header flex items-center justify-between">
      <div class="topic-comment__header__left flex items-center">
        <UserAvatar
          v-if="comment.user"
          class="m-r-12"
          style="box-shadow: var(--box-shadow)"
          :user="comment.user"
          size="27"
          initialsSize="14"
          color="silver-light"
        />
        <span
          v-else
          class="topic-comment__header__left__user flex items-center justify-center m-r-12"
        >
          <BIMDataIcon name="user" size="xxs" fill color="granite" />
        </span>

        <BIMDataTextbox width="auto" maxWidth="150px" cutPosition="end" :text="comment.author" />
        <span class="color-granite m-x-6"> • </span>
        <span class="color-granite">
          {{ $d(comment.date, "long") }}
        </span>
      </div>

      <div class="topic-comment__header__right">
        <div class="topic-comment__header__right__actions flex">
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
            <BIMDataButton ghost rounded icon @click="cancelUpdate">
              <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="submitUpdate">
              <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </template>
        </div>
        <div v-if="isDeleting" class="topic-comment__header__right__delete p-x-12">
          <span>
            {{ $t("BcfComponents.BcfTopicComments.deleteCommentText") }}
          </span>
          <div class="flex items-center">
            <BIMDataButton class="m-r-6" color="high" fill radius @click="submitDelete">
              {{ $t("BcfComponents.BcfTopicComments.deleteButton") }}
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="isDeleting = false">
              <BIMDataIcon name="close" size="xxs" fill color="primary" />
            </BIMDataButton>
          </div>
        </div>
        <BIMDataButton
          v-if="!showMenu && !isDeleting && !isEditing"
          class="topic-comment__header__right__btn"
          rounded
          icon
          @click="toggleMenu"
        >
          <BIMDataIcon name="ellipsis" size="l" fill color="granite-light" />
        </BIMDataButton>
      </div>
    </div>

    <div class="topic-comment__content">
      <BIMDataTextarea
        :class="{ editing: isEditing }"
        width="100%"
        rows="1"
        v-model="text"
        fitContent
        autofocus
        :resizable="false"
        :readonly="!isEditing"
      />
      <div class="topic-comment__content__snapshot" v-if="viewpoint && viewpoint.snapshot">
        <img :src="viewpoint.snapshot.snapshot_data" @click="openTopicSnapshot(viewpoint)" />
        <BIMDataButton
          v-if="isEditing"
          class="btn-delete"
          fill
          rounded
          icon
          @click="deleteViewpoint"
        >
          <BIMDataIcon name="delete" size="xs" fill color="high" />
        </BIMDataButton>
      </div>
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useService } from "../../../../service.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";
import BIMDataTextbox from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextbox.js";
import TopicCommentSnapshotModal from "../topic-comment-snapshot-modal/TopicCommentSnapshotModal.vue";

// TODO: should be imported from DS
import UserAvatar from "../../../user-avatar/UserAvatar.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataLoading,
    BIMDataTextarea,
    BIMDataTextbox,
    UserAvatar,
    TopicCommentSnapshotModal,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    topic: {
      type: Object,
      required: true,
    },
    comment: {
      type: Object,
      required: true,
    },
  },
  emits: ["comment-updated", "comment-deleted"],

  setup(props, { emit }) {
    const $viewer = inject("$viewer");

    const service = useService();

    const loading = ref(false);

    const showMenu = ref(false);
    const closeMenu = () => (showMenu.value = false);
    const toggleMenu = () => (showMenu.value = !showMenu.value);

    const text = ref(props.comment.comment);

    const viewpoint = ref(null);
    const loadViewpoint = async () => {
      viewpoint.value = await service.fetchTopicCommentViewpoint(
        props.project,
        props.topic,
        props.comment
      );
    };
    onMounted(async () => {
      if (props.comment.viewpoint_guid) {
        await loadViewpoint();
      }
    });

    const isEditing = ref(false);
    const onOpenEdit = () => {
      isEditing.value = true;
      closeMenu();
    };
    const cancelUpdate = () => {
      isEditing.value = false;
      text.value = props.comment.comment;
    };
    const deleteViewpoint = async () => {
      await service.deleteViewpoint(props.project, props.topic, viewpoint.value);
      viewpoint.value = null;
    };
    const submitUpdate = async () => {
      try {
        if (props.comment.comment !== text.value) {
          loading.value = true;
          if (viewpoint.value) {
            const newComment = await service.updateComment(
              props.project,
              props.topic,
              props.comment,
              { comment: text.value, viewpoint_guid: viewpoint.value.guid }
            );
            emit("comment-updated", newComment);
          } else {
            const newComment = await service.updateComment(
              props.project,
              props.topic,
              props.comment,
              { comment: text.value, viewpoint_guid: null }
            );
            emit("comment-updated", newComment);
          }
        }
        isEditing.value = false;
      } finally {
        loading.value = false;
      }
    };

    const isDeleting = ref(false);
    const onOpenDelete = () => {
      isDeleting.value = true;
      closeMenu();
    };
    const submitDelete = async () => {
      try {
        loading.value = true;
        await service.deleteComment(props.project, props.topic, props.comment);
        emit("comment-deleted", props.comment);
        isDeleting.value = false;
      } finally {
        loading.value = false;
      }
    };

    const openTopicSnapshot = (topic) => {
      if ($viewer) {
        $viewer.globalContext.modals.pushModal(TopicCommentSnapshotModal, { topic });
      }
    };

    return {
      // References
      isDeleting,
      isEditing,
      loading,
      showMenu,
      text,
      viewpoint,
      // Methods
      cancelUpdate,
      closeMenu,
      deleteViewpoint,
      onOpenDelete,
      onOpenEdit,
      submitDelete,
      submitUpdate,
      toggleMenu,
      loadViewpoint,
      openTopicSnapshot,
    };
  },
};
</script>

<style scoped lang="scss" src="./TopicComment.scss"></style>
