import {
  VIEWPOINT_CONFIG,
  VIEWPOINT_MODELS_FIELD,
  VIEWPOINT_TYPE_FIELD
} from "../config.js";

function getViewpointType(viewpoint) {
  return viewpoint[VIEWPOINT_TYPE_FIELD];
}

function getViewpointModels(viewpoint) {
  return viewpoint[VIEWPOINT_MODELS_FIELD]?.split(",").map(Number) ?? [];
}

function getViewpointConfig(viewpoint) {
  return VIEWPOINT_CONFIG[getViewpointType(viewpoint)];
}

function setViewpointDefaults(viewpoint) {
  if (!viewpoint.components.selection) {
    viewpoint.components.selection = [];
  }
  if (!viewpoint.components.visibility) {
    viewpoint.components.visibility = {
      default_visibility: true,
      exceptions: [],
      view_setup_hints: {
        spaces_visible: false,
        space_boundaries_visible: false,
        openings_visible: false,
      },
    };
  }
  return viewpoint;
}

export {
  getViewpointType,
  getViewpointModels,
  getViewpointConfig,
  setViewpointDefaults,
};
