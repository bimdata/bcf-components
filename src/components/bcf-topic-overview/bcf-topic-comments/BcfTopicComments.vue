<template>
  <div class="bcf-topic-comments">
    <BIMDataButton
      v-if="!isOpen"
      width="100%"
      color="primary"
      fill
      radius
      @click="isOpen = true"
    >
      {{ $t("BcfComponents.BcfTopicComments.commentButton") }}
    </BIMDataButton>

    <div
      v-else
      class="bcf-topic-comments__post-comment m-t-24"
    >
      <p class="color-granite m-b-24">
        {{ $t("BcfComponents.BcfTopicComments.commentText") }}
      </p>
      <div class="bcf-comment-input m-t-24">
        <BIMDataTextarea
          ref="input"
          width="100%"
          :label="$t('BcfComponents.BcfTopicComments.commentLabel')"
          v-model="text"
          autofocus
          resizable
        />
        <div class="flex items-center justify-end">
          <BIMDataButton
            color="primary"
            ghost
            radius
            class="m-r-6"
            @click="isOpen = false"
          >
            {{ $t("BcfComponents.BcfTopicComments.cancelButton") }}
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            fill
            radius
            width="135px"
            @click="submitComment"
          >
            {{ $t("BcfComponents.BcfTopicComments.publishButton") }}
          </BIMDataButton>
        </div>
      </div>
    </div>

    <div class="bcf-topic-comments__list m-t-18">
      <p class="color-granite">
        {{ (comments ? comments.length : 0) + " " + $t("BcfComponents.BcfTopicComments.commentsText") }}
      </p>
      <div v-if="comments && comments.length">
        <TopicComment
          v-for="comment in comments"
          :key="comment.guid"
          :project="project"
          :topic="topic"
          :comment="comment"
          @comment-updated="onCommentUpdated"
          @comment-deleted="onCommentDeleted"
        />
      </div>
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useService } from "../../../service.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";
import TopicComment from "./topic-comment/TopicComment.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataLoading,
    BIMDataTextarea,
    TopicComment,
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    topic: {
      type: Object,
      required: true
    },
  },
  emis: [
    "comment-created",
    "comment-updated",
    "comment-deleted",
  ],
  setup(props, { emit }) {
    const service = useService();

    const comments = ref([]);
    const isOpen = ref(false);
    const loading = ref(false);
    const input = ref(null);
    const text = ref("");

    const loadComments = async () => {
      comments.value = await service.fetchTopicComments(props.project, props.topic);
    };

    const submitComment = async () => {
      try {
        loading.value = true;
        const comment = await service.createComment(
          props.project,
          props.topic,
          { comment: text.value }
        );
        loadComments();
        emit("comment-created", comment);
        isOpen.value = false;
        text.value = "";
      } finally {
        loading.value = false;
      }
    };

    const onCommentUpdated = comment => {
      loadComments();
      emit("comment-updated", comment);
    };

    const onCommentDeleted = comment => {
      loadComments();
      emit("comment-deleted", comment);
    };

    watch(
      () => props.topic,
      () => loadComments(),
      { immediate: true }
    );

    watch(isOpen, () =>
      setTimeout(() => isOpen.value && input.value.focus(), 50)
    );

    return {
      // References
      comments,
      input,
      isOpen,
      loading,
      text,
      // Methods
      loadComments,
      onCommentDeleted,
      onCommentUpdated,
      submitComment
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicComments.scss"></style>
