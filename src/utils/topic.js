import { DEFAULT_PRIORITY_COLOR, DEFAULT_STATUS_COLOR } from "../config.js";

function getPriorityColor(topic, detailedExtensions) {
  const priorityDetail = detailedExtensions.priorities.find(
    p => p.priority === topic.priority
  );
  return priorityDetail?.color || DEFAULT_PRIORITY_COLOR;
}

function getStatusColor(topic, detailedExtensions) {
  const statusDetail = detailedExtensions.topicStatuses.find(
    s => s.topicStatus === topic.topicStatus
  );
  return statusDetail?.color || DEFAULT_STATUS_COLOR;
}

export { getPriorityColor, getStatusColor };
