import { resolve } from "path";
import { defineConfig } from "vite";
import libCss from "vite-plugin-libcss";

// Vite plugins for Vue 2
import { createVuePlugin as vue } from "vite-plugin-vue2";

const config = defineConfig({
  plugins: [
    vue(),
    libCss(),
  ],
  build: {
    outDir: "dist/vue2",
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      formats: ["es"],
      fileName: "bcf-components",
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into library
      external: [
        "vue",
        "@vue/composition-api",
      ],
    },
  }
});

export default config;
