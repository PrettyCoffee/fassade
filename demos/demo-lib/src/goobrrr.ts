import { createElement } from "react"

import { setup } from "goobrrr"
import { pretty, minify, strict } from "goobrrr/plugins"

import { theme } from "./theme"

declare module "goobrrr" {
  interface SetupConfig {
    theme: typeof theme
  }
}

setup({
  theme,
  jsx: createElement,
  plugins: import.meta.env.DEV ? [pretty(), strict()] : [minify()],
})

export * from "goobrrr"
export * from "goobrrr/jsx"
