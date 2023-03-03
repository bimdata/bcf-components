import { getRandomHexColor } from "@bimdata/design-system/dist/colors.js";
import eachLimit from "async/eachLimit";
import { getExtensionField } from "./utils/extensions.js";
import { getPriorityColor } from "./utils/topic.js";

let libService = null;

function createService(apiClient, { fetchUsers }) {

  const getUsers = fetchUsers
    ? project => fetchUsers(project)
    : project => apiClient.collaborationApi.getProjectUsers(project.cloud.id, project.id);

  // --- BCF Topics API ---

  const fetchTopics = async (project, { extensions, users } = {}) => {
    const _extensions = extensions ?? (await apiClient.bcfApi.getDetailedExtensions(project.id));
    const _users = users ?? (await getUsers(project));

    const topics = await apiClient.bcfApi.getTopics(project.id);
    topics.sort((a, b) => b.index - a.index);
    topics.forEach(topic => {
      topic.color = getPriorityColor(topic, _extensions);
      topic.creator = _users.find(u => u.email === topic.creation_author);
    });

    return topics;
  };

  const fecthTopicByGuid = async (project, guid) => {
    const extensions = await apiClient.bcfApi.getDetailedExtensions(project.id);
    const topic = await apiClient.bcfApi.getFullTopic(guid, project.id, "url");
    topic.color = getPriorityColor(topic, extensions);
    return topic;
  };

  const createTopic = async (project, topic) => {
    return await apiClient.bcfApi.createFullTopic(
      project.id,
      topic
    );
  };

  const updateTopic = async (project, topic) => {
    return await apiClient.bcfApi.updateFullTopic(
      topic.guid,
      project.id,
      "url",
      topic
    );
  };

  const deleteTopic = async (project, topic) => {
    await apiClient.bcfApi.deleteTopic(
      topic.guid,
      project.id,
    );
  };


  // --- BCF Topic Viewpoints API ---

  const loadTopicsViewpoints = async (project, topics) => {
    await eachLimit(topics, 10, async topic => {
      topic.viewpoints = await fetchTopicViewpoints(project, topic);
    });
    return topics;
  };

  const fetchTopicViewpoints = async (project, topic) => {
    return await apiClient.bcfApi.getTopicViewpoints(
      project.id,
      topic.guid,
      "url"
    );
  };

  const fetchTopicCommentViewpoint = async (project, topic, comment) => {
    return await apiClient.bcfApi.getViewpoint(
      comment.viewpoint_guid,
      project.id,
      topic.guid,
    );
  };

  const createViewpoint = async (project, topic, data) => {
    return await apiClient.bcfApi.createViewpoint(
      project.id,
      topic.guid,
      "url",
      data
    );
  };

  const deleteViewpoint = async (project, topic, viewpoint) => {
    await apiClient.bcfApi.deleteViewpoint(
      viewpoint.guid,
      project.id,
      topic.guid,
    );
  };


  // --- BCF Topic Comments API ---

  const fetchTopicComments = async (project, topic) => {
    const users = await getUsers(project);

    const comments = await apiClient.bcfApi.getComments(project.id, topic.guid);
    comments.sort((a, b) => (a.date > b.date ? -1 : 1));
    comments.forEach(c => {
      c.user = users.find(u => u.email === c.author);
    });

    return comments;
  };

  const createComment = async (project, topic, data) => {
    return await apiClient.bcfApi.createComment(
      project.id,
      topic.guid,
      data
    );
  };

  const updateComment = async (project, topic, comment, data) => {
    return await apiClient.bcfApi.updateComment(
      comment.guid,
      project.id,
      topic.guid,
      data
    );
  };

  const deleteComment = async (project, topic, comment) => {
    await apiClient.bcfApi.deleteComment(
      comment.guid,
      project.id,
      topic.guid,
    );
  };


  // --- BCF Extensions API ---

  const fetchExtensions = (project) => {
    return apiClient.bcfApi.getExtensions(project.id);
  };

  const fetchDetailedExtensions = (project) => {
    return apiClient.bcfApi.getDetailedExtensions(project.id);
  };

  const createExtension = async (project, type, data) => {
    return await apiClient.bcfApi[`createExtension${type}`](
      project.id,
      {
        [getExtensionField(type)]: data.value,
        color: getRandomHexColor(),
      }
    );
  };

  const updateExtension = async (project, type, extension, data) => {
    return await apiClient.bcfApi[`updateExtension${type}`](
      extension.id,
      project.id,
      {
        [getExtensionField(type)]: data.value,
        color: data.color,
      }
    );
  };

  const deleteExtension = async (project, type, extension) => {
    await apiClient.bcfApi[`deleteExtension${type}`](
      extension.id,
      project.id,
    );
  };

  return {
    fetchTopics,
    fecthTopicByGuid,
    createTopic,
    updateTopic,
    deleteTopic,
    loadTopicsViewpoints,
    fetchTopicViewpoints,
    fetchTopicCommentViewpoint,
    createViewpoint,
    deleteViewpoint,
    fetchTopicComments,
    createComment,
    updateComment,
    deleteComment,
    fetchExtensions,
    fetchDetailedExtensions,
    createExtension,
    updateExtension,
    deleteExtension,
  };
}


function setService(service) {
  libService = service;
}

function useService() {
  return libService;
}

export { createService, setService, useService };
