import {
  DEFAULT_PRIORITY_COLOR,
  DEFAULT_STATUS_COLOR,
  VIEWPOINT_CONFIG,
  VIEWPOINT_MODELS_FIELD,
  VIEWPOINT_TYPE_FIELD
} from "../config.js";

function getPriorityColor(topic, detailedExtensions) {
  const priorityDetail = detailedExtensions.priorities.find(
    p => p.priority === topic.priority
  );
  return priorityDetail?.color || DEFAULT_PRIORITY_COLOR;
}

function getStatusColor(topic, detailedExtensions) {
  const statusDetail = detailedExtensions.topic_statuses.find(
    s => s.topic_status === topic.topic_status
  );
  return statusDetail?.color || DEFAULT_STATUS_COLOR;
}

function getViewpointType(viewpoint) {
  return viewpoint[VIEWPOINT_TYPE_FIELD];
}

function getViewpointModels(viewpoint) {
  return viewpoint[VIEWPOINT_MODELS_FIELD]?.split(",").map(Number) ?? [];
}

function getViewpointConfig(viewpoint) {
  return VIEWPOINT_CONFIG[getViewpointType(viewpoint)];
}

export {
  getPriorityColor,
  getStatusColor,
  getViewpointType,
  getViewpointModels,
  getViewpointConfig,
};
