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
  getViewpointType,
  getViewpointModels,
  getViewpointConfig,
};
