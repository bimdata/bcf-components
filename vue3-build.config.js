import { resolve } from "path";
import { defineConfig } from "vite";
import libCss from "vite-plugin-libcss";

// Vite plugins for Vue 3
import replace from "@rollup/plugin-replace";
import vue from "@vitejs/plugin-vue";

const config = defineConfig({
  plugins: [
    replace({
      "@bimdata/design-system/dist/js/BIMDataComponents": "@bimdata/design-system/dist/js/BIMDataComponents/vue3",
      "@vue/composition-api": "vue",
      delimiters: ["", ""],
      preventAssignment: true,
    }),
    vue(),
    libCss(),
  ],
  build: {
    outDir: "dist/vue3",
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      formats: ["es"],
      fileName: "bcf-components",
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into library
      external: [
        "vue",
      ],
    },
  },
});

export default config;
