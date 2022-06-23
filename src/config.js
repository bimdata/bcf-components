const EXTENSION_TYPES = [
  "Priority",
  "Type",
  "Stage",
  "Status",
  "Label"
];

const EXTENSION_WITH_COLOR = [
  "Priority",
  "Status"
];

const EXTENSION_FIELDS = {
  Priority: "priority",
  Type: "topic_type",
  Stage: "stage",
  Status: "topic_status",
  Label: "label",
};

const EXTENSION_LIST_FIELDS = {
  Priority: "priorities",
  Type: "topic_types",
  Stage: "stages",
  Status: "topic_statuses",
  Label: "topic_labels",
};

const DEFAULT_PRIORITY_COLOR = "D8D8D8";
const DEFAULT_STATUS_COLOR = "D8D8D8";

export {
  DEFAULT_PRIORITY_COLOR,
  DEFAULT_STATUS_COLOR,
  EXTENSION_FIELDS,
  EXTENSION_LIST_FIELDS,
  EXTENSION_TYPES,
  EXTENSION_WITH_COLOR,
};
