import cozy from "@pretty-cozy/oxlint-config"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [cozy.base, cozy.react, cozy.vitest],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
  },
  options: {
    typeAware: true,
    typeCheck: true,
    reportUnusedDisableDirectives: "error",
    denyWarnings: true,
  },
  rules: {
    "typescript/no-explicit-any": "off",
    "eslint/max-params": "off",
  },
  overrides: [
    {
      files: ["**/*.test.*"],
      rules: {
        "eslint/no-empty-function": "off", // empty functions are sumetimes usefull for implementation mocks
      },
    },
  ],
})
