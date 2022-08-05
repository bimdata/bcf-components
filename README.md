<h1 align="center">BIMData BCF components library</h1>

A set (library) of Vue components to manage BCF and build BCF related
features into your app.

Made with :heart: by [BIMData.io](https://bimdata.io/).

## Usage

Install:
```bash
npm install @bimdata/bcf-components
```

Then refer to the next sub-sections on how to use the library depending
on which version of Vue you're using.

### Vue 2.7+ application

**Note:** the library won't work as expected for versions of Vue below **2.7**.

In your Vue 2.7 application bootstrap script, add the following:

```js
import Vue from "vue";
import VueI18n from "vue-i18n"; // v8.x
import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";  // v8.2+
// Import Vue 2 plugin factory
import BIMDataBcfComponents from "@bimdata/bcf-components/vue2-plugin.js";
...

// Instanciate i18n plugin
const i18nPlugin = new VueI18n({ ... });
// Instanciate BIMData API client
const apiClient = makeBIMDataApiClient({ ... });

Vue.use(i18nPlugin);
// Provide both i18n plugin and API client as plugin config
Vue.use(BIMDataBcfComponents({ i18nPlugin, apiClient }));
...
```

### Vue 3.x application

**Using Vue plugin**

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

**Using "manual" setup**

To setup the library without the use of the plugin you have to provide your own translations
(as described above in the *Using Vue plugin* section) and inject an API client like so:

```js
import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";
// Import the `setApiClient` function
import { setApiClient } from "@bimdata/bcf-components";

// Instanciate BIMData API client (v8.2+)
const apiClient = makeBIMDataApiClient({ ... });

// Inject API client
setApiClient(apiClient);
```

Then you can directly use components in your app that way:

```js
import { BcfTopicCard } from "@bimdata/bcf-components";
```

## Build

```bash
npm run build
```
