import { type CssTemplate } from "../core/css-template"
import { type StyleNode } from "../core/parser"
import { css } from "../css"

type GlobalStyleNode = Record<string, StyleNode>

/** CSS Global function to declare global styles. */
export const glob = (...args: CssTemplate["Args"] | [GlobalStyleNode]) => {
  // oxlint-disable-next-line no-unused-expressions
  css(...(args as CssTemplate["Args"])).withConfig({ type: "global" }).class
}

/** Creates the global styles component to be used in jsx. */
export function createGlobalStyles(
  ...args: CssTemplate["Args"] | [GlobalStyleNode]
) {
  // oxlint-disable-next-line no-unused-vars -- global is used in the function below
  const global = css(...(args as CssTemplate["Args"])).withConfig({
    type: "global",
  })
  return () => (global.class, null)
}
