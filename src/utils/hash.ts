import { parser, type StyleNode } from "./parser"
import { updateSheet } from "./style-sheet"
import { toHash } from "./to-hash"

/** In-memory cache to store generated styles. */
const styleCache: Record<string, string> = {}

/** Empty the hash cache. Should only be used in unit testing. */
export const resetStyleCache = () =>
  Object.keys(styleCache).forEach(key => delete styleCache[key])

/** Stringifies an object structure. */
const getIdentifier = (
  data: StyleNode | StyleNode[string] | undefined,
): string => {
  if (typeof data !== "object") return String(data ?? "")
  let out = ""
  for (const key in data) out += key + getIdentifier(data[key])
  return out
}

export const createClassName = (compiled: StyleNode | string) =>
  toHash(getIdentifier(compiled))

export type InjectionType = "class" | "global" | "keyframes"

const createStyles = (
  className: string,
  compiled: StyleNode | string,
  type: InjectionType,
) => {
  const selector = {
    class: `.${className}`,
    keyframes: `@keyframes ${className}`,
    global: undefined,
  }[type]

  const getStylesString = () => {
    const ast =
      typeof compiled === "string" ? parser.toObject(compiled) : compiled
    return parser.toString(ast, selector, type)
  }

  // without a hashed selector, there is no stable key representing the styles
  return !selector
    ? getStylesString()
    : (styleCache[selector] ??= getStylesString())
}

const update = (css: string, append?: boolean, cssToReplace?: string) =>
  updateSheet((data, ssr = "") => {
    if ((ssr + data).includes(css)) return data
    if (cssToReplace) return data.replace(cssToReplace, css)
    return append ? css + data : data + css
  })

/**
 * Generates the needed className.
 *
 * @param compiled Css to process.
 * @param append Append or prepend.
 * @param type What kind of css needs to be injected.
 */
export const hash = (
  compiled: StyleNode | string,
  append?: boolean,
  type: InjectionType = "class",
) => {
  const className = createClassName(compiled)
  const styles = createStyles(className, compiled, type)

  // If the global flag is set, save the current stringified and compiled CSS to `cache.g`
  // to allow replacing styles in <style /> instead of appending them.
  // This is required for using `createGlobalStyles` with themes
  if (type === "global") {
    update(styles, append, styleCache["g"])
    styleCache["g"] = styles
  } else {
    update(styles, append)
  }

  return className
}
