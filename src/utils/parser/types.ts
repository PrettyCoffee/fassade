type CssAttributeName = Exclude<
  keyof CSSStyleProperties,
  keyof CSSStyleDeclarationBase
>

export type StyleNode = Partial<Record<CssAttributeName, string | number>> & {
  [selector: string]: StyleNode | string | number
}
