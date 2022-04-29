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
  Type: "topicType",
  Stage: "stage",
  Status: "topicStatus",
  Label: "label",
};

const EXTENSION_LIST_FIELDS = {
  Priority: "priorities",
  Type: "topicTypes",
  Stage: "stages",
  Status: "topicStatuses",
  Label: "topicLabels",
};

const DEFAULT_PRIORITY_COLOR = "D8D8D8";
const DEFAULT_STATUS_COLOR = "D8D8D8";

const MODEL_TYPE = Object.freeze({
  BFX: "BFX",
  DAE: "DAE",
  DWG: "DWG",
  DXF: "DXF",
  GLTF: "GLTF",
  IFC: "IFC",
  JPEG: "JPEG",
  JPG: "JPEG",
  META_BUILDING: "METABUILDING",
  OBJ: "OBJ",
  PDF: "PDF",
  PNG: "PNG"
});

const MODEL_STATUS = Object.freeze({
  PENDING: "P",
  IN_PROGRESS: "I",
  COMPLETED: "C",
  ERROR: "E"
});

export {
  DEFAULT_PRIORITY_COLOR,
  DEFAULT_STATUS_COLOR,
  EXTENSION_FIELDS,
  EXTENSION_LIST_FIELDS,
  EXTENSION_TYPES,
  EXTENSION_WITH_COLOR,
  MODEL_TYPE,
  MODEL_STATUS,
};
