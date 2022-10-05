import { EXTENSION_FIELDS, EXTENSION_LIST_FIELDS } from "../config.js";

function getExtensionField(type) {
  return EXTENSION_FIELDS[type];
}

function getAvailableExtensions(type, detailedExtensions) {
  return detailedExtensions[EXTENSION_LIST_FIELDS[type]];
}

export {
  getExtensionField,
  getAvailableExtensions,
};
