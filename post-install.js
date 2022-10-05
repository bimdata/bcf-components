const FILE = "./node_modules/vue-template-compiler/index.js";

const { readFileSync, writeFileSync } = require("fs");

let content = readFileSync(FILE, { encoding: "utf8" });
content = content.replace(/require\('vue'\)/g, "require('vue2')");
writeFileSync(FILE, content, { encoding: "utf8" });
