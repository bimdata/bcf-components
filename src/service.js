import { getRandomHexColor } from "@bimdata/design-system/src/BIMDataComponents/BIMDataColorSelector/colors.js";
import eachLimit from "async/eachLimit";
import { getExtensionField } from "./utils/extensions.js";
import { getPriorityColor } from "./utils/topic.js";
import { downloadBlobAs } from "./utils/download.js";

class Service {
  constructor () {
    if (!Service.instance) Service.instance = this;
    return Service.instance;
  }

  setup({ apiClient, fetchUsers }) {
    this.apiClient = apiClient;
    this.fetchUsers = fetchUsers;
  }

  _getUsers(project) {
    return this.fetchUsers
      ? this.fetchUsers(project)
      : this.apiClient.collaborationApi.getProjectUsers(project.cloud.id, project.id);
  }

  fetchCurrentUser() {
    return this.apiClient.bcfApi.getUser();
  }

  // --- BCF Topics API ---

  async fetchTopics(project, { extensions, users } = {}) {
    const _extensions = extensions ?? (await this.apiClient.bcfApi.getDetailedExtensions(project.id));
    const _users = users ?? (await this._getUsers(project));

    const topics = await this.apiClient.bcfApi.getTopics(project.id);
    topics.sort((a, b) => b.index - a.index);
    topics.forEach((topic) => {
      topic.color = getPriorityColor(topic, _extensions);
      topic.creator = _users.find((u) => u.email === topic.creation_author);
    });

    return topics;
  }

  async fecthTopicByGuid(project, guid) {
    const extensions = await this.apiClient.bcfApi.getDetailedExtensions(project.id);
    const topic = await this.apiClient.bcfApi.getFullTopic(guid, project.id, "url");
    topic.color = getPriorityColor(topic, extensions);
    return topic;
  }

  createTopic(project, topic) {
    return this.apiClient.bcfApi.createTopic(project.id, topic);
  }

  updateTopic(project, topic) {
    return this.apiClient.bcfApi.updateTopic(topic.guid, project.id, topic);
  }

  deleteTopic(project, topic) {
    return this.apiClient.bcfApi.deleteTopic(topic.guid, project.id);
  }

  async importBcf(project, file) {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    await fetch(`${this.apiClient.config.basePath}/bcf/2.1/projects/${project.id}/import`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...this.apiClient.authHeader,
      },
      body: formData,
    });
  }

  async exportBcf(project, topics) {
    const response = await this.apiClient.bcfApi.downloadBcfExport(
      project.id,
      undefined, // Format
      topics.map((t) => t.guid).join(",")
    );
    downloadBlobAs(`${project.name}.bcf`, response);
  }

  async exportBcfXLSX(project, topics) {
    const response = await this.apiClient.bcfApi.downloadBcfExportXlsx(
      project.id,
      undefined, // Format
      undefined, // Locale
      topics.map((t) => t.guid).join(",")
    );
    downloadBlobAs(`${project.name}.xlsx`, response);
  }

  // --- BCF Topic Viewpoints API ---

  async loadTopicsViewpoints(project, topics) {
    await eachLimit(topics, 10, (topic, done) => {
      fetchTopicViewpoints(project, topic).then(viewpoints => {
        topic.viewpoints = viewpoints;
        done();
      }, done);
    });
    return topics;
  }

  fetchTopicViewpoints(project, topic) {
    return this.apiClient.bcfApi.getTopicViewpoints(project.id, topic.guid, "url");
  }

  fetchTopicCommentViewpoint(project, topic, comment) {
    return this.apiClient.bcfApi.getViewpoint(comment.viewpoint_guid, project.id, topic.guid);
  }

  createViewpoint(project, topic, viewpoint) {
    return this.apiClient.bcfApi.createViewpoint(project.id, topic.guid, "url", viewpoint);
  }

  updateViewpoint(project, topic, viewpoint) {
    return this.apiClient.bcfApi.updateViewpoint(viewpoint.guid, project.id, topic.guid, "url", viewpoint);
  }

  deleteViewpoint(project, topic, viewpoint) {
    return this.apiClient.bcfApi.deleteViewpoint(viewpoint.guid, project.id, topic.guid);
  }

  // --- BCF Topic Comments API ---

  async fetchTopicComments(project, topic) {
    const users = await this._getUsers(project);

    const comments = await this.apiClient.bcfApi.getComments(project.id, topic.guid);
    comments.sort((a, b) => (a.date > b.date ? -1 : 1));
    comments.forEach((c) => {
      c.user = users.find((u) => u.email === c.author);
    });

    return comments;
  }

  createComment(project, topic, data) {
    return this.apiClient.bcfApi.createComment(project.id, topic.guid, data);
  }

  updateComment(project, topic, comment, data) {
    return this.apiClient.bcfApi.updateComment(comment.guid, project.id, topic.guid, data);
  }

  deleteComment(project, topic, comment) {
    return this.apiClient.bcfApi.deleteComment(comment.guid, project.id, topic.guid);
  }

  // --- BCF Extensions API ---

  fetchExtensions(project) {
    return this.apiClient.bcfApi.getExtensions(project.id);
  }

  fetchDetailedExtensions(project) {
    return this.apiClient.bcfApi.getDetailedExtensions(project.id);
  }

  createExtension(project, type, data) {
    return this.apiClient.bcfApi[`createExtension${type}`](project.id, {
      [getExtensionField(type)]: data.value,
      color: getRandomHexColor(),
    });
  }

  updateExtension(project, type, extension, data) {
    return this.apiClient.bcfApi[`updateExtension${type}`](extension.id, project.id, {
      [getExtensionField(type)]: data.value,
      color: data.color,
    });
  }

  deleteExtension(project, type, extension) {
    return this.apiClient.bcfApi[`deleteExtension${type}`](extension.id, project.id);
  }
}

const service = new Service();

export default service;
