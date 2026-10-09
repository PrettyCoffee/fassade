import { createElement } from "react"

import { setup } from "fassade"
import { pretty, minify, strict } from "fassade/plugins"

import { theme } from "./theme"

declare module "fassade" {
  interface SetupConfig {
    theme: typeof theme
  }
}

setup({
  theme,
  jsx: createElement,
  plugins: import.meta.env.DEV ? [pretty(), strict()] : [minify()],
})

export * from "fassade"
export * from "fassade/jsx"
