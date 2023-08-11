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
          <BIMDataIconUser size="xxs" fill color="granite" />
        </span>

        <BIMDataTextbox width="auto" maxWidth="150px" cutPosition="end" :text="comment.author" />
        <span class="color-granite m-x-6"> • </span>
        <span class="color-granite">
          {{ $d(comment.date, "long") }}
        </span>
      </div>

      <div class="topic-comment__header__right">
        <template v-if="currentUserEmail === comment.author">
          <div class="topic-comment__header__right__actions flex">
            <template v-if="showMenu">
              <BIMDataButton ghost rounded icon @click="onOpenEdit">
                <BIMDataIconEdit size="xxs" fill color="granite-light" />
              </BIMDataButton>
              <BIMDataButton ghost rounded icon @click="onOpenDelete">
                <BIMDataIconDelete size="xxs" fill color="granite-light" />
              </BIMDataButton>
              <BIMDataButton ghost rounded icon @click="toggleMenu">
                <BIMDataIconClose size="xxs" fill color="granite-light" />
              </BIMDataButton>
            </template>
            <template v-if="isEditing">
              <BIMDataButton ghost rounded icon @click="cancelUpdate">
                <BIMDataIconUndo size="xxs" fill color="granite-light" />
              </BIMDataButton>
              <BIMDataButton ghost rounded icon @click="submitUpdate">
                <BIMDataIconValidate size="xxs" fill color="granite-light" />
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
                <BIMDataIconClose size="xxs" fill color="primary" />
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
            <BIMDataIconEllipsis size="l" fill color="granite-light" />
          </BIMDataButton>
        </template>
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
      <div v-if="isViewer && isEditing && !viewpoint" class="flex">
        <div
          class="topic-comment__content__camera m-r-12"
          @click="setCommentViewpoint"
          v-if="!viewerSelectVisible"
        >
          <BIMDataIconCamera fill color="default" />
        </div>
        <BIMDataDropdownList
          v-if="viewerSelectVisible"
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
      <div class="topic-comment__content__snapshot" v-if="viewpoint && viewpoint.snapshot">
        <img :src="viewpoint.snapshot.snapshot_data" @click="openCommentSnapshot(viewpoint)" />
        <BIMDataButton
          v-if="isEditing"
          class="btn-delete"
          fill
          rounded
          icon
          @click="deleteViewpoint"
        >
          <BIMDataIconDelete size="xs" fill color="high" />
        </BIMDataButton>
      </div>
    </div>

    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { inject, onMounted, ref, onBeforeUnmount } from "vue";
import { useService } from "../../../../service.js";
// Components
import BIMDataButton from "@bimdata/design-system/src/BIMDataComponents/BIMDataButton/BIMDataButton.vue";
import {
  BIMDataIconUser,
  BIMDataIconEdit,
  BIMDataIconDelete,
  BIMDataIconClose,
  BIMDataIconUndo,
  BIMDataIconValidate,
  BIMDataIconEllipsis,
  BIMDataIconCamera,
} from "@bimdata/design-system/src/BIMDataComponents/BIMDataIcon/BIMDataIconStandalone/index.js";
import BIMDataLoading from "@bimdata/design-system/src/BIMDataComponents/BIMDataLoading/BIMDataLoading.vue";
import BIMDataTextarea from "@bimdata/design-system/src/BIMDataComponents/BIMDataTextarea/BIMDataTextarea.vue";
import BIMDataTextbox from "@bimdata/design-system/src/BIMDataComponents/BIMDataTextbox/BIMDataTextbox.vue";

// TODO: should be imported from DS
import UserAvatar from "../../../user-avatar/UserAvatar.vue";

export default {
  components: {
    BIMDataButton,
    BIMDataIconUser,
    BIMDataIconEdit,
    BIMDataIconDelete,
    BIMDataIconClose,
    BIMDataIconUndo,
    BIMDataIconValidate,
    BIMDataIconEllipsis,
    BIMDataIconCamera,
    BIMDataLoading,
    BIMDataTextarea,
    BIMDataTextbox,
    UserAvatar,
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
    currentUserEmail: {
      type: String,
      required: true,
    },
    getViewers: {
      type: Function,
    },
  },
  emits: ["comment-updated", "comment-deleted", "view-comment-snapshot"],

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
      if (viewpoint.value.guid) {
        await service.deleteViewpoint(props.project, props.topic, viewpoint.value);
      }
      viewpoint.value = null;
    };
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

    const createViewpoint = async ({ viewer }) => {
      unhighlightViewer(viewer);
      viewerSelectVisible.value = false;
      viewpoint.value = await viewer.getViewpoint();
    };

    const submitUpdate = async () => {
      try {
        if (props.comment.comment === text.value && !viewpoint.value) {
          isEditing.value = false;
          return;
        }
        if (viewpoint.value && !viewpoint.value.guid) {
          viewpoint.value = await service.createViewpoint(
            props.project,
            props.topic,
            viewpoint.value
          );
        }
        if (
          props.comment.comment !== text.value ||
          props.comment.viewpoint_guid !== viewpoint.value.guid
        ) {
          loading.value = true;

          const newComment = await service.updateComment(
            props.project,
            props.topic,
            props.comment,
            { comment: text.value, viewpoint_guid: viewpoint.value?.guid }
          );
          emit("comment-updated", newComment);
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

    const openCommentSnapshot = (viewpoint) => {
      if ($viewer) {
        $viewer.globalContext.modals.pushModal(
          {
            template: `<img :src="viewpoint.snapshot.snapshot_data" />`,
            props: {
              viewpoint: {
                type: Object,
                required: true,
              },
            },
          },
          { viewpoint }
        );
      } else {
        emit("view-comment-snapshot", viewpoint);
      }
    };

    let pluginCreatedSubId;
    let pluginDestroyedSubId;
    onMounted(async () => {
      if (props.comment.viewpoint_guid) {
        await loadViewpoint();
      }
      if ($viewer) {
        const listViewerOptions = () => {
          return Object.entries(props.getViewers?.() ?? [])
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
      isDeleting,
      isEditing,
      isViewer: Boolean($viewer),
      loading,
      showMenu,
      text,
      viewerSelectOptions,
      viewerSelectVisible,
      viewpoint,
      // Methods
      cancelUpdate,
      closeMenu,
      createViewpoint,
      deleteViewpoint,
      highlightViewer,
      onOpenDelete,
      onOpenEdit,
      openCommentSnapshot,
      setCommentViewpoint,
      submitDelete,
      submitUpdate,
      toggleMenu,
      loadViewpoint,
      unhighlightViewer,
    };
  },
};
</script>

<style scoped lang="scss" src="./TopicComment.scss"></style>
