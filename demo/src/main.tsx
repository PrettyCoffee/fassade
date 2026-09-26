import { StrictMode } from "react"
import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { setup } from "goobrrr"

import { App } from "./App"
import { GlobalStyles } from "./GlobalStyles"

setup({ jsx: createElement })

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
)
