import {
  createService,
  setService,
  components
} from "./dist/vue3/bcf-components.mjs";
import messages from "./dist/i18n/index.js";

/**
 * BCF Components library plugin for Vue 3.
 * Here are the actions the plugin will perform:
 *  - initialize library service
 *  - register components translations
 *  - globally register BCF components
 * 
 * @param {
 *  {
 *    apiClient: Object,
 *    fetchUsers?: Promise,
 *    i18nPlugin: Object,
 *    includedComponents?: string[],
 *    excludedComponents?: string[],
 *  } 
 * }
 */
const pluginFactory = ({
  apiClient,
  fetchUsers,
  i18nPlugin,
  includedComponents = [],
  excludedComponents = [],
} = {}) => {
  return {
    install(app) {
      if (apiClient) {
        const service = createService(apiClient, { fetchUsers });
        setService(service);
      } else {
        console.error(
          "[BCF Components Plugin] No api client provided. " +
          "You must provide an api client for the components " +
          "to work properly."
        );
      }

      if (i18nPlugin) {
        Object.entries(messages).forEach(([locale, translations]) => {
          i18nPlugin.global.mergeLocaleMessage(locale, translations);
        });
      } else {
        console.warn(
          "[BCF Components Plugin] No i18n instance provided. " +
          "You should either provide an i18n instance or define " +
          "your own translations in order have text displayed properly."
        );
      }

      Object.entries(components)
        .forEach(([name, component]) => {
          // Do not register excluded components.
          if (excludedComponents.includes(name)) {
            return;
          }
          // Only register included components if any.
          // Otherwise register all (non excluded) components.
          if (
            includedComponents.length === 0 ||
            includedComponents.includes(name)
          ) {
            app.component(name, component);
          }
        });
    },
  };
};

export default pluginFactory;
