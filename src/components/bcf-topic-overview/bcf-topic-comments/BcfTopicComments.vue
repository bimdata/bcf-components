<template>
  <div class="bcf-topic-comments">
    <template v-if="uiConfig.commentCreation">
      <BIMDataButton v-if="!isOpen" width="100%" color="primary" fill radius @click="isOpen = true">
        {{ $t("BcfComponents.BcfTopicComments.commentButton") }}
      </BIMDataButton>

      <div v-else class="bcf-topic-comments__post-comment m-t-24">
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
          <div class="bcf-topic-comments__post-comment__snapshot m-b-12" v-if="viewpoint">
            <img v-if="viewpoint.snapshot.snapshot_data" :src="viewpoint.snapshot.snapshot_data" />
            <BIMDataButton class="btn-delete" fill rounded icon @click="deleteViewpoint">
              <BIMDataIconDelete size="xs" fill color="high" />
            </BIMDataButton>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                v-if="isViewer && !viewerSelectVisible"
                class="bcf-topic-comments__post-comment__camera m-r-12"
                @click="setCommentViewpoint"
              >
                <BIMDataIconCamera fill color="default" />
              </div>
              <BIMDataDropdownList
                v-if="isViewer && viewerSelectVisible"
                :list="viewerSelectOptions"
                elementKey="key"
                @element-click="createViewpoint"
                width="180px"
              >
                <template #header>
                  {{ $t("BcfComponents.BcfTopicComments.takeSnapshot") }}
                </template>
                <template #element="{ element }">
                  <div
                    style="width: 100%"
                    @mouseenter="highlightViewer(element.context)"
                    @mouseleave="unhighlightViewer(element.context)"
                  >
                    {{ `(${element.index}) ${element.name}` }}
                  </div>
                </template>
              </BIMDataDropdownList>
            </div>
            <div class="flex items-center justify-end">
              <BIMDataButton color="primary" ghost radius class="m-r-6" @click="isOpen = false">
                {{ $t("BcfComponents.BcfTopicComments.cancelButton") }}
              </BIMDataButton>
              <BIMDataButton color="primary" fill radius width="135px" @click="submitComment">
                {{ $t("BcfComponents.BcfTopicComments.publishButton") }}
              </BIMDataButton>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="bcf-topic-comments__list m-t-18">
      <p class="color-granite">
        {{
          (comments ? comments.length : 0) + " " + $t("BcfComponents.BcfTopicComments.commentsText")
        }}
      </p>
      <div v-if="comments && comments.length">
        <TopicComment
          v-for="comment in comments"
          :key="comment.guid"
          :project="project"
          :topic="topic"
          :comment="comment"
          :currentUserEmail="currentUserEmail"
          @comment-updated="onCommentUpdated"
          @comment-deleted="onCommentDeleted"
          @view-comment-snapshot="$emit('view-comment-snapshot', $event)"
        />
      </div>
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { onMounted, inject, ref, watch, onBeforeUnmount } from "vue";
import service from "../../../service.js";
import { getViewerOptions, getViewerViewpoint, highlightViewer, unhighlightViewer } from "../../../utils/viewer.js";

// Components
import TopicComment from "./topic-comment/TopicComment.vue";

export default {
  components: {
    TopicComment,
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
    uiConfig: {
      type: Object,
      required: true,
    },
    currentUserEmail: {
      type: String,
      required: false,
    },
  },
  emis: ["comment-created", "comment-updated", "comment-deleted", "view-comment-snapshot"],
  setup(props, { emit }) {
    let windowOpenSub, windowCloseSub;

    const $viewer = inject("$viewer", null);

    const loading = ref(false);
    const isOpen = ref(false);
    const input = ref(null);
    const comments = ref([]);
    const text = ref("");
    const viewpoint = ref(null);
    const viewerSelectVisible = ref(false);
    const viewerSelectOptions = ref([]);

    const loadComments = async () => {
      comments.value = await service.fetchTopicComments(props.project, props.topic);
    };

    const setCommentViewpoint = async () => {
      viewerSelectOptions.value = getViewerOptions($viewer);

      if (viewerSelectOptions.value.length === 1) {
        await createViewpoint(viewerSelectOptions.value[0]);
      } else if (viewerSelectOptions.value.length > 1) {
        viewerSelectVisible.value = true;
      }
    };

    const createViewpoint = async ({ context }) => {
      unhighlightViewer(context);
      viewerSelectVisible.value = false;
      viewpoint.value = await getViewerViewpoint(context);
    };

    const deleteViewpoint = () => {
      viewpoint.value = null;
    };

    const submitComment = async () => {
      try {
        loading.value = true;
        if (viewpoint.value) {
          viewpoint.value = await service.createViewpoint(
            props.project,
            props.topic,
            viewpoint.value
          );
        }
        const comment = await service.createComment(props.project, props.topic, {
          comment: text.value,
          viewpoint_guid: viewpoint.value?.guid,
        });
        loadComments();
        emit("comment-created", comment);
        isOpen.value = false;
        text.value = "";
      } finally {
        loading.value = false;
        viewpoint.value = null;
      }
    };

    const onCommentUpdated = (comment) => {
      loadComments();
      emit("comment-updated", comment);
    };

    const onCommentDeleted = (comment) => {
      loadComments();
      emit("comment-deleted", comment);
    };

    watch(
      () => props.topic,
      () => loadComments(),
      { immediate: true }
    );

    watch(isOpen, () => setTimeout(() => isOpen.value && input.value.focus(), 50));

    onMounted(() => {
      if ($viewer) {
        const hideViewerSelect = () => {
          viewerSelectVisible.value = false;
        };
        windowOpenSub = $viewer.globalContext.hub.on("window-open", hideViewerSelect);
        windowCloseSub = $viewer.globalContext.hub.on("window-close", hideViewerSelect);
      }
    });

    onBeforeUnmount(() => {
      if ($viewer) {
        $viewer.globalContext.hub.off(windowOpenSub);
        $viewer.globalContext.hub.off(windowCloseSub);
      }
    });

    return {
      // References
      comments,
      input,
      isOpen,
      isViewer: Boolean($viewer),
      loading,
      text,
      viewerSelectOptions,
      viewerSelectVisible,
      viewpoint,
      // Methods
      createViewpoint,
      deleteViewpoint,
      highlightViewer,
      loadComments,
      onCommentDeleted,
      onCommentUpdated,
      setCommentViewpoint,
      submitComment,
      unhighlightViewer,
    };
  },
};
</script>

<style scoped lang="scss" src="./BcfTopicComments.scss"></style>
