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
 * Viewpoint config
 */

const VIEWPOINT_TYPE_FIELD = "originating_system";
const VIEWPOINT_MODELS_FIELD = "authoring_tool_id";

const VIEWPOINT_TYPES = Object.freeze({
  V3D: "ifc3d",
  V2D: "ifc2d",
  DWG: "dwg",
  PLAN: "plan",
});

const VIEWPOINT_CONFIG = Object.freeze({
  [VIEWPOINT_TYPES.V3D]: {
    order: 1,
    window: "3d",
    plugin: "viewer3d",
    icon: "fileIfcPolychrome",
  },
  [VIEWPOINT_TYPES.V2D]: {
    order: 2,
    window: "2d",
    plugin: "viewer2d",
    icon: "fileIfcPolychrome",
  },
  [VIEWPOINT_TYPES.DWG]: {
    order: 3,
    window: "dwg",
    plugin: "dwg",
    icon: "fileDwgPolychrome",
  },
  [VIEWPOINT_TYPES.PLAN]: {
    order: 4,
    window: "plan",
    plugin: "plan",
    icon: "filePlanPolychrome",
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
  VIEWPOINT_MODELS_FIELD,
  VIEWPOINT_TYPES,
  VIEWPOINT_TYPE_FIELD,
};
