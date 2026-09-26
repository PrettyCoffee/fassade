import { createElement } from "react"

import { setup } from "goobrrr"
import { minify } from "goobrrr/plugins"

setup({ jsx: createElement, plugins: [minify()] })

export { css, recipe, styled, keyframes } from "goobrrr"
export { createGlobalStyles } from "goobrrr/global"
