import { setApiClient, components } from "./dist/vue2/bcf-components.es.js";
import messages from "./dist/i18n/index.js";

/**
 * BCF Components library plugin for Vue 2.
 * Here are the actions the plugin will perform:
 *  - set library api client
 *  - register components translations
 *  - globally register BCF components
 * 
 * @param {
 *  {
 *    apiClient: Object,
 *    i18nPlugin: Object,
 *    includedComponents?: string[],
 *    excludedComponents?: string[],
 *  } 
 * } [cfg]
 */
const pluginFactory = ({
  apiClient,
  i18nPlugin,
  includedComponents = [],
  excludedComponents = [],
} = {}) => {
  return {
    install(Vue) {
      if (apiClient) {
        setApiClient(apiClient);
      } else {
        console.error(
          "[BCF Components Plugin] No api client provided. " +
          "You must provide an api client for the components " +
          "to work properly."
        );
      }

      if (i18nPlugin) {
        Object.entries(messages).forEach(([locale, translations]) => {
          i18nPlugin.mergeLocaleMessage(locale, translations);
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
            Vue.component(name, component);
          }
        });
    },
  };
};

export default pluginFactory;
