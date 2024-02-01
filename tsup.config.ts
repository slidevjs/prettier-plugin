import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  target: "node18",
  dts: true,
  clean: true,
  onSuccess: "node ./test/index.js",
});
