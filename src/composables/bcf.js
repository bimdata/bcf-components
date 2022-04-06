import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";
import { reactive, toRefs } from "@vue/composition-api";
import mapLimit from "async/mapLimit";

const apiUrl = "https://api-staging.bimdata.io";

const apiClient = makeBIMDataApiClient({ apiUrl });

const state = reactive({
  bcfTopics: [],
  extensions: [],
  detailedExtensions: {
    topicTypes: [],
    priorities: [],
    topicStatuses: [],
    labels: [],
    stages: []
  }
});


// --- BCF Topics API ---

const loadBcfTopics = async project => {
  const topics = await apiClient.bcfApi.getTopics({
    projectsPk: project.id
  });

  let topicsWithViewpoints = [];

  topicsWithViewpoints = await mapLimit(topics, 10, async topic => {
    const viewpoints = await apiClient.bcfApi.getTopicViewpoints({
      projectsPk: project.id,
      topicsGuid: topic.guid,
      imgFormat: "url"
    });

    topic.viewpoints = viewpoints;
    return topic;
  });

  state.bcfTopics = topicsWithViewpoints;

  return topicsWithViewpoints;
};

const createFullTopic = async (project, topic) => {
  const newTopic = await fetch(
    `${apiUrl}/bcf/2.1/projects/${project.id}/full-topic`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...apiClient.authHeader
      },
      body: JSON.stringify(topic)
    }
  );
  await loadBcfTopics(project);
  return newTopic;
};

const createTopic = async (project, topic) => {
  const newTopic = await apiClient.bcfApi.createTopic({
    projectsPk: project.id,
    data: topic
  });
  await loadBcfTopics(project);
  return newTopic;
};

const updateTopic = async (project, bcfTopic, topic) => {
  const newTopic = await fetch(
    `${apiUrl}/bcf/2.1/projects/${project.id}/full-topic/${bcfTopic.guid}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        ...apiClient.authHeader
      },
      body: JSON.stringify(topic)
    }
  );
  await loadBcfTopics(project);
  return newTopic;
};

const deleteTopic = async (project, topic) => {
  await apiClient.bcfApi.deleteTopic({
    projectsPk: project.id,
    guid: topic.guid
  });
  await loadBcfTopics(project);
};

const createViewpoint = async (project, topic, data) => {
  const newViewpoint = await apiClient.bcfApi.createViewpoint({
    projectsPk: project.id,
    topicsGuid: topic.guid,
    data
  });
  await loadBcfTopics(project);
  return newViewpoint;
};

const deleteViewpoint = async (project, topic, viewpoint) => {
  await apiClient.bcfApi.deleteViewpoint({
    projectsPk: project.id,
    topicsGuid: topic.guid,
    guid: viewpoint.guid
  });
  // We don't want to reload topic here because this method
  // may be called many times in parallel
};

const importBcf = async (project, file) => {
  const formData = new FormData();
  formData.append("name", file.name);
  formData.append("file", file);
  const bcf = await fetch(
    `${apiUrl}/bcf/2.1/projects/${project.id}/import`,
    {
      method: "POST",
      headers: {
        ...apiClient.authHeader
      },
      body: formData
    }
  );
  await loadBcfTopics(project);
  await loadDetailedExtensions(project);
  return bcf;
};

const exportBcf = project => {
  return fetch(
    `${apiUrl}/bcf/2.1/projects/${project.id}/export`,
    {
      method: "GET",
      headers: {
        ...apiClient.authHeader
      }
    }
  );
};


// --- BCF Extensions API ---

const loadExtensions = async project => {
  const extensions = await apiClient.bcfApi.getExtensions({
    id: project.id
  });
  state.extensions = extensions;
  return extensions;
};

const loadDetailedExtensions = async project => {
  const detailedExtensions = await apiClient.bcfApi.getDetailedExtensions({
    id: project.id
  });
  state.detailedExtensions = detailedExtensions;
  return detailedExtensions;
};

const createExtension = async (project, extensionType, data) => {
  const newExtension = await apiClient.bcfApi["createExtension" + extensionType]({
    projectsPk: project.id,
    data
  });
  await loadDetailedExtensions(project);
  return newExtension;
};

const updateExtension = async (project, extensionType, extensionId, data) => {
  const newExtension = await apiClient.bcfApi["updateExtension" + extensionType]({
    projectsPk: project.id,
    id: extensionId,
    data
  });
  await loadDetailedExtensions(project);
  return newExtension;
};

const deleteExtension = async (project, extensionType, extension) => {
  await apiClient.bcfApi["deleteExtension" + extensionType]({
    projectsPk: project.id,
    id: extension.id
  });
  await loadDetailedExtensions(project);
};


// --- BCF Comments API ---

const loadTopicComments = async (project, topic) => {
  let allComments = await apiClient.bcfApi.getComments({
    projectsPk: project.id,
    topicsGuid: topic.guid
  });
  allComments.sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1));
  topic.comments = allComments;
  return allComments;
};

const createComment = async (project, topic, data) => {
  const newComment = await apiClient.bcfApi.createComment({
    projectsPk: project.id,
    topicsGuid: topic.guid,
    data
  });
  await loadTopicComments(project, topic);
  return newComment;
};

const updateComment = async (project, topic, comment, data) => {
  const newComment = await apiClient.bcfApi.updateComment({
    projectsPk: project.id,
    topicsGuid: topic.guid,
    guid: comment.guid,
    data
  });
  await loadTopicComments(project, topic);
  return newComment;
};

const deleteComment = async (project, topic, comment) => {
  await apiClient.bcfApi.deleteComment({
    projectsPk: project.id,
    topicsGuid: topic.guid,
    guid: comment.guid
  });
  await loadTopicComments(project, topic);
};

export function useBcf() {
  return {
    // References
    ...toRefs(state),
    // Methods
    loadBcfTopics,
    createFullTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    createViewpoint,
    deleteViewpoint,
    importBcf,
    exportBcf,
    loadExtensions,
    loadDetailedExtensions,
    createExtension,
    updateExtension,
    deleteExtension,
    loadTopicComments,
    createComment,
    updateComment,
    deleteComment,
  };
}
