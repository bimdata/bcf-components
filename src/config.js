const EXTENSION_TYPES = Object.freeze([
  "Priority",
  "Type",
  "Stage",
  "Status",
  "Label"
]);

const EXTENSION_WITH_COLOR = Object.freeze([
  "Priority",
  "Status"
]);

const EXTENSION_FIELDS = Object.freeze({
  Priority: "priority",
  Type: "topic_type",
  Stage: "stage",
  Status: "topic_status",
  Label: "label",
});

const EXTENSION_LIST_FIELDS = Object.freeze({
  Priority: "priorities",
  Type: "topic_types",
  Stage: "stages",
  Status: "topic_statuses",
  Label: "topic_labels",
});

const DEFAULT_PRIORITY_COLOR = "D8D8D8";
const DEFAULT_STATUS_COLOR = "D8D8D8";

/**
 * Viewpoint types (`viewpoint.authoring_tool_id`)
 */
const VIEWPOINT_TYPES = Object.freeze({
  DWG: "dwg",
  PLAN: "plan",
  V2D: "ifc2d",
  V3D: "ifc3d",
});

const VIEWPOINT_CONFIG = Object.freeze({
  [VIEWPOINT_TYPES.DWG]: {
    window: "dwg",
    plugin: "dwg",
    icon: "fileDwgPolychrome",
  },
  [VIEWPOINT_TYPES.PLAN]: {
    window: "plan",
    plugin: "plan",
    icon: "filePlanPolychrome",
  },
  [VIEWPOINT_TYPES.V2D]: {
    window: "2d",
    plugin: "viewer2d",
    icon: "fileIfcPolychrome",
  },
  [VIEWPOINT_TYPES.V3D]: {
    window: "3d",
    plugin: "viewer3d",
    icon: "fileIfcPolychrome",
  },
});

export {
  DEFAULT_PRIORITY_COLOR,
  DEFAULT_STATUS_COLOR,
  EXTENSION_FIELDS,
  EXTENSION_LIST_FIELDS,
  EXTENSION_TYPES,
  EXTENSION_WITH_COLOR,
  VIEWPOINT_CONFIG,
  VIEWPOINT_TYPES,
};
