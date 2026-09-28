import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./app"
import { GlobalStyles } from "./global-styles"

const root = document.getElementById("root")
if (!root) throw new Error("No root node found")

createRoot(root).render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
)
