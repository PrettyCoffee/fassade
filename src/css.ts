import {
  joinCssTemplate,
  isCssTemplate,
  type CssTemplate,
} from "./utils/css-template"
import { type StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"

/** Create styles, inject them into the DOM, and generate a css class. */
export function css(styles: StyleNode): Styles
export function css(...args: CssTemplate["Args"]): Styles
export function css(...args: [StyleNode] | CssTemplate["Args"]) {
  const [styles, ...values] = args

  if (isCssTemplate(styles)) {
    return new Styles(joinCssTemplate(styles, ...values))
  }
  return new Styles(styles)
}

/** Declare global styles. */
export const glob = (...args: CssTemplate["Args"]) => {
  css(...args)
    .withConfig({ type: "global" })
    .inject()
}

/** Keyframes function for defining animations. */
export const keyframes = (...args: CssTemplate["Args"]) =>
  css(...args)
    .withConfig({ type: "keyframes" })
    .inject()
