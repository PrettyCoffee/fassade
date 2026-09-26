import { createElement } from "react"

import { setup } from "goobrrr"
import { pretty, minify } from "goobrrr/plugins"

setup({
  jsx: createElement,
  plugins: import.meta.env.DEV ? [pretty()] : [minify()],
})

export { css, recipe, styled, keyframes } from "goobrrr"
export { createGlobalStyles } from "goobrrr/global"
