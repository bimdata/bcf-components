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
              <BIMDataIcon name="delete" size="xs" fill color="high" />
            </BIMDataButton>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="bcf-topic-comments__post-comment__camera m-r-12"
                @click="setCommentViewpoint"
                v-if="!viewerSelectVisible && isViewer"
              >
                <BIMDataIcon name="camera" fill color="default" />
              </div>
              <BIMDataDropdownList
                v-if="viewerSelectVisible && isViewer"
                :list="viewerSelectOptions"
                elementKey="key"
                @element-click="createViewpoint"
                width="180px"
              >
                <template #header>{{ $t("BcfComponents.BcfTopicComments.takeSnapshot") }}</template>
                <template #element="{ element }">
                  <div
                    style="width: 100%"
                    @mouseenter="highlightViewer(element.viewer)"
                    @mouseleave="unhighlightViewer(element.viewer)"
                  >
                    {{ `${element.id} (${element.index})` }}
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
import { VIEWPOINT_CONFIG, VIEWPOINT_MODELS_FIELD, VIEWPOINT_TYPE_FIELD } from "../../../config.js";
import { useService } from "../../../service.js";

// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataDropdownList from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataDropdownList.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataLoading.js";
import BIMDataTextarea from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTextarea.js";
import TopicComment from "./topic-comment/TopicComment.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataDropdownList,
    BIMDataIcon,
    BIMDataLoading,
    BIMDataTextarea,
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
      required: true,
    },
  },
  emis: ["comment-created", "comment-updated", "comment-deleted", "view-comment-snapshot"],
  setup(props, { emit }) {
    const service = useService();

    const comments = ref([]);
    const isOpen = ref(false);
    const loading = ref(false);
    const input = ref(null);
    const text = ref("");
    const viewpoint = ref(null);

    const loadComments = async () => {
      comments.value = await service.fetchTopicComments(props.project, props.topic);
    };

    const getViewers = inject("getViewers", () => ({}));
    const $viewer = inject("$viewer");

    const viewerSelectVisible = ref(false);
    const viewerSelectOptions = ref([]);

    const highlightViewer = (viewer) => {
      viewer.$viewer.localContext.el.style.border = "2px solid var(--color-primary)";
      viewer.$viewer.localContext.el.style.boxSizing = "border-box";
      viewer.$viewer.localContext.el.style.opacity = ".85";
    };
    const unhighlightViewer = (viewer) => {
      viewer.$viewer.localContext.el.style.border = "";
      viewer.$viewer.localContext.el.style.boxSizing = "";
      viewer.$viewer.localContext.el.style.opacity = "";
    };

    const setCommentViewpoint = async () => {
      if (viewerSelectOptions.value.length === 1) {
        await createViewpoint(viewerSelectOptions.value[0]);
      } else if (viewerSelectOptions.value.length > 1) {
        viewerSelectVisible.value = true;
      }
    };
    const createViewpoint = async ({ id, viewer }) => {
      unhighlightViewer(viewer);
      viewerSelectVisible.value = false;

      const [type] = Object.entries(VIEWPOINT_CONFIG).find(([, c]) => c.plugin === id);
      viewpoint.value = Object.assign(await viewer.getViewpoint(), {
        [VIEWPOINT_TYPE_FIELD]: type,
        [VIEWPOINT_MODELS_FIELD]: viewer
          .getLoadedModels()
          .map((m) => m.id)
          .join(","),
      });
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

    let pluginCreatedSubId;
    let pluginDestroyedSubId;

    onMounted(() => {
      if ($viewer) {
        const listViewerOptions = () => {
          return Object.entries(getViewers())
            .map(([id, list]) =>
              list.map((v, i) => ({ key: `${id}-${i}`, id, index: i, viewer: v }))
            )
            .flat();
        };
        viewerSelectOptions.value = listViewerOptions();
        pluginCreatedSubId = $viewer.globalContext.hub.on("plugin-created", () => {
          viewerSelectOptions.value = listViewerOptions();
        });
        pluginDestroyedSubId = $viewer.globalContext.hub.on("plugin-destroyed", () => {
          viewerSelectOptions.value = listViewerOptions();
        });
      }
    });

    onBeforeUnmount(() => {
      if ($viewer) {
        $viewer.globalContext.hub.off(pluginCreatedSubId);
        $viewer.globalContext.hub.off(pluginDestroyedSubId);
      }
    });

    return {
      // References
      comments,
      input,
      isOpen,
      loading,
      text,
      viewerSelectOptions,
      viewerSelectVisible,
      viewpoint,
      isViewer: Boolean($viewer),
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