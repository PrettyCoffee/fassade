import react from "@vitejs/plugin-react"
import { defineConfig } from "waku/config"

export default defineConfig({
  vite: {
    server: { port: 5173 },
    plugins: [react()],
  },
})
