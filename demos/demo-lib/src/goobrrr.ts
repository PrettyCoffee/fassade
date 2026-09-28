import { createElement } from "react"

import { setup } from "goobrrr"
import { pretty, strict, minify } from "goobrrr/plugins"

setup({
  jsx: createElement,
  plugins: import.meta.env.DEV ? [pretty(), strict()] : [minify()],
})

export * from "goobrrr"
export * from "goobrrr/jsx"
