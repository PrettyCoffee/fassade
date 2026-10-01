import { defineConfig } from "vite"

const compat = import.meta.resolve("preact/compat")
const jsxRuntime = import.meta.resolve("preact/jsx-runtime")

// demo-lib imports react, so every react entry point is pointed at preact
export default defineConfig({
  resolve: {
    alias: [
      { find: /^react\/jsx(-dev)?-runtime$/, replacement: jsxRuntime },
      { find: /^react(-dom)?$/, replacement: compat },
    ],
  },
})
