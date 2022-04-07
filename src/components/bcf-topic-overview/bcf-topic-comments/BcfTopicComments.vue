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
      {{ $t("Poster un commentaire") }}
    </BIMDataButton>

    <div
      v-else
      class="bcf-topic-comments__post-comment m-t-24"
    >
      <p class="color-granite m-b-24">
        {{ $t("Commentaire") }}
      </p>
      <div class="bcf-comment-input m-t-24">
        <BIMDataTextarea
          ref="commentInput"
          width="100%"
          autofocus
          resizable
          :label="$t('Poster un commentaire')"
          name="example"
          v-model="topicComment"
        />
        <div></div>
        <div class="flex items-center justify-end">
          <BIMDataButton
            color="primary"
            ghost
            radius
            class="m-r-6"
            @click="isOpen = false"
          >
            {{ $t("Annuler") }}
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            fill
            radius
            width="135px"
            @click="publishComment"
          >
            {{ $t("Publier") }}
          </BIMDataButton>
        </div>
      </div>
    </div>

    <div class="bcf-topic-comments__list m-t-18">
      <p class="color-granite">
        {{ bcfTopic.comments?.length || 0 }}
        {{ $t("Commentaires") }}
      </p>
      <div v-if="bcfTopic.comments?.length">
        <Comment
          v-for="comment in bcfTopic.comments"
          :key="comment"
          :project="project"
          :bcfTopic="bcfTopic"
          :comment="comment"
        />
      </div>
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { useBcf } from "../../composables/bcf.js";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataLoading.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataTextarea.js";
import Comment from "../comment/Comment.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataLoading,
    BIMDataTextarea,
    Comment,
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { createComment } = useBcf();

    const isOpen = ref(false);
    const loading = ref(false);
    const commentInput = ref(null);
    const topicComment = ref("");

    watch(isOpen, () =>
      setTimeout(() => isOpen.value && commentInput.value.focus(), 100)
    );


    const publishComment = async () => {
      try {
        loading.value = true;
        await createComment(props.project, props.bcfTopic, {
          comment: topicComment.value
        });
      } finally {
        loading.value = false;
        topicComment.value = null;
      }
    };

    return {
      // References
      commentInput,
      isOpen,
      loading,
      topicComment,
      // Methods
      publishComment
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicComments.scss"></style>
