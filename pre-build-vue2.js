const { existsSync, readFileSync, writeFileSync } = require("fs");

const VUE_TEMPLATE_COMPILER = "./node_modules/vue-template-compiler/index.js";

if (existsSync(VUE_TEMPLATE_COMPILER)) {

  let content = readFileSync(VUE_TEMPLATE_COMPILER, { encoding: "utf8" });

  content = content.replace(/require\('vue'\)/g, "require('vue2')");

  writeFileSync(VUE_TEMPLATE_COMPILER, content, { encoding: "utf8" });
}
