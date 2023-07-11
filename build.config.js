import libCss from "@bimdata/vite-plugin-libcss";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy as copy } from "vite-plugin-static-copy";

const config = defineConfig({
  plugins: [
    vue(),
    libCss(),
    copy({
      targets: [
        { src: "src/i18n", dest: "" }
      ]
    }),
  ],
  build: {
    outDir: "dist",
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
