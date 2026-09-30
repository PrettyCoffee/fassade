import { type CSSProperties } from "react"

/* Alternative to using @types/react and csstypes, if the packages are removed
type CssAttributeName = Exclude<
  keyof CSSStyleProperties,
  keyof CSSStyleDeclarationBase
  >
type CssProperties = Partial<Record<CssAttributeName, string | number>>
*/

export type StyleNode = CSSProperties & {
  [cssVarOrSelector: string]: StyleNode | string | number
}
