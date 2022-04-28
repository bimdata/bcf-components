import * as Components from "./dist/vue3/bcf-components.es.js";
import messages from "./dist/i18n/index.js";

/**
 * BCF Components library plugin for Vue 3.
 * Here are the actions the plugin will perform:
 *  - globally register BCF components
 *  - register components translations
 * 
 * @param {
 *  {
 *    includedComponents?: string[],
 *    excludedComponents?: string[],
 *    i18n: Object,
 *  } 
 * } [cfg]
 */
const pluginFactory = ({
  includedComponents = [],
  excludedComponents = [],
  i18n
} = {}) => {
  return {
    install(app) {
      Object.entries(Components)
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
      
      if (i18n) {
        Object.entries(messages).forEach(([locale, translations]) => {
          i18n.global.mergeLocaleMessage(locale, translations);
        });
      } else {
        console.warn(
          "[BCF Components Plugin] No i18n instance provided." +
          "You should either provide an i18n instance or " +
          "your own translations in order have text displayed proerl.y"
        );
      }
    },
  };
};

export default pluginFactory;
