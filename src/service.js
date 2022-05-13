import { useApiClient } from "./api-client.js";
import { EXTENSION_FIELDS } from "./config.js";
import { getRandomHexColor } from "./utils/colors.js";


// --- BCF Topics API ---

const createTopic = async (project, topic) => {
  return await useApiClient().bcfApi.createFullTopic(
    project.id,
    topic
  );
};

const updateTopic = async (project, topic) => {
  return await useApiClient().bcfApi.updateFullTopic(
    topic.guid,
    project.id,
    "url",
    topic
  );
};

const deleteTopic = async (project, topic) => {
  await useApiClient().bcfApi.deleteTopic(
    topic.guid,
    project.id,
  );
};


// --- BCF Topic Viewpoints API ---

const createViewpoint = async (project, topic, data) => {
  return await useApiClient().bcfApi.createViewpoint(
    project.id,
    topic.guid,
    "url",
    data
  );
};

const deleteViewpoint = async (project, topic, viewpoint) => {
  await useApiClient().bcfApi.deleteViewpoint(
    viewpoint.guid,
    project.id,
    topic.guid,
  );
};


// --- BCF Topic Comments API ---

const createComment = async (project, topic, data) => {
  return await useApiClient().bcfApi.createComment(
    project.id,
    topic.guid,
    data
  );
};

const updateComment = async (project, topic, comment, data) => {
  return await useApiClient().bcfApi.updateComment(
    comment.guid,
    project.id,
    topic.guid,
    data
  );
};

const deleteComment = async (project, topic, comment) => {
  await useApiClient().bcfApi.deleteComment(
    comment.guid,
    project.id,
    topic.guid,
  );
};


// --- BCF Extensions API ---

const createExtension = async (project, extensionType, data) => {
  return await useApiClient().bcfApi[`createExtension${extensionType}`](
    project.id,
    {
      [EXTENSION_FIELDS[extensionType]]: data.value,
      color: getRandomHexColor(),
    }
  );
};

const updateExtension = async (project, extensionType, extension, data) => {
  return await useApiClient().bcfApi[`updateExtension${extensionType}`](
    extension.id,
    project.id,
    {
      [EXTENSION_FIELDS[extensionType]]: data.value,
      color: data.color,
    }
  );
};

const deleteExtension = async (project, extensionType, extension) => {
  await useApiClient().bcfApi[`deleteExtension${extensionType}`](
    extension.id,
    project.id,
  );
};


export function useService() {
  return {
    createTopic,
    updateTopic,
    deleteTopic,
    createViewpoint,
    deleteViewpoint,
    createComment,
    updateComment,
    deleteComment,
    createExtension,
    updateExtension,
    deleteExtension,
  };
}
