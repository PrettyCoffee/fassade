import { css } from "../css"
import { type CssTemplate } from "../utils/css-template"
import { type StyleNode } from "../utils/parser"

type GlobalStyleNode = Record<string, StyleNode>

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
