import { defineConfig } from "tsdown"

export default defineConfig({
  tsconfig: "tsconfig.build.json",
  entry: [
    "./src/index.ts",
    "./src/global/index.ts",
    "./src/should-forward-prop/index.ts",
  ],
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
})
