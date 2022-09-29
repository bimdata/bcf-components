import { EXTENSION_LIST_FIELDS } from "../config.js";

function getAvailableExtensions(type, detailedExtensions) {
  return detailedExtensions[EXTENSION_LIST_FIELDS[type]];
}

export {
  getAvailableExtensions,
};
