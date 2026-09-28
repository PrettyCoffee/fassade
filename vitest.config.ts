import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/tests/test-setup.ts"],
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: ["**/*.d.ts"],
      reporter: "text", // CLI only
    },
  },
})
