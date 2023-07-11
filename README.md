<h1 align="center">BIMData BCF components library</h1>

A set (library) of Vue components to manage BCF and build BCF related
features into your app.

Made with :heart: by [BIMData.io](https://bimdata.io/).

## Usage

Install:
```bash
npm install @bimdata/bcf-components
```

### Vue 3.x application

> **Note:** The library is built for Vue 3.x applications, it is no longer intended
> to work with older version of Vue.

The package provide a Vue plugin that can be used to setup the library for your app
and make all components available globally.

```js
import { createApp } from "vue";
import { createI18n } from "vue-i18n"; // v9.x
import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client"; // v8.2+
// Import Vue 3 plugin factory
import BIMDataBcfComponents from "@bimdata/bcf-components/vue3-plugin.js";

// Instanciate i18n plugin
const i18nPlugin = createI18n({ ... });
// Instanciate BIMData API client
const apiClient = makeBIMDataApiClient({ ... });

const app = createApp()
  .use(i18nPlugin)
  // Provide both i18n plugin and API client as plugin config
  .use(BIMDataBcfComponents({ i18nPlugin, apiClient }));
...
```

It is also possible to provide your own translations for i18n by removing
`i18nPlugin` from plugin config and adding translation keys from
[`src/i18n/lang/fr.js`](./src/i18n/lang/fr.json) to the translation files of your app.

## Build

```bash
npm run build
```
