import { render } from "preact"

import { App } from "./app"
import { GlobalStyles } from "./global-styles"

const root = document.getElementById("root")
if (!root) throw new Error("No root node found")

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  root,
)
