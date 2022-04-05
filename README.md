<h1 align="center">BIMData BCF components library</h1>

A set (library) of Vue components to manage BCF and build BCF related
features into your app.

Made with :heart: by [BIMData.io](https://github.com/bimdata).

## Usage

Install:
```bash
npm install @bimdata/bcf-components
```

Then refer to the next sub-sections on how to use the library depending
on which version of Vue you're using.

### Vue 2.6+ application

In order to use the library in your Vue 2 app you'll need to use
[Vue Composition API plugin](https://github.com/vuejs/composition-api).

First add it to your dependencies:
```bash
npm install @vue/composition-api
```

Then, in your application bootstrap script, add the following:
```js
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
...

Vue.use(VueCompositionApi);
...
```

You can now use library components like so:
```js
import { HelloWorld } from "@bimdata/bcf-components/dist/vue2/bcf-components.es.js";
```

### Vue 3.x application

In Vue 3 app you can directly use components that way:
```js
import { HelloWorld } from "@bimdata/bcf-components";
```

## Build

```bash
npm run build
```
