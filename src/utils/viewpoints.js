import { VIEWPOINT_CONFIG } from "../config.js";

function getViewpointConfig(viewpoint) {
  return VIEWPOINT_CONFIG[viewpoint.originating_system];
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
  getViewpointConfig,
  setViewpointDefaults,
};
