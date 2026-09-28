import { type Conditional, type Template } from "../util-types"
import { parser, type StyleNode } from "./parser"
import { Styles } from "./styles"

export type CssTemplate = Template<
  | Conditional<Styles | StyleNode | string | number>
  | Conditional<Styles | StyleNode | string | number>[]
>

export const getCssString = (value: CssTemplate["Value"]): string => {
  if (value == null || value === false) return ""
  if (Array.isArray(value)) return value.map(getCssString).join("")
  if (value instanceof Styles) return value.toString()
  if (typeof value === "object") return parser.toString(value)
  return String(value)
}

export const joinCssTemplate: CssTemplate["Fn"] = (strings, ...values) =>
  strings
    .flatMap((string, index) => [string, getCssString(values[index])])
    .join("")

export const isCssTemplate = (
  value: TemplateStringsArray | string[] | StyleNode,
): value is TemplateStringsArray | string[] => Array.isArray(value)
