import { type Sheet } from "./get-sheet"
import { parser, type StyleNode } from "./parser"
import { toHash } from "./to-hash"
import { update } from "./update"

/** In-memory cache. */
const cache: Record<string, string> = {}

/** Empty the hash cache. Should only be used in unit testing. */
export const resetHashCache = () =>
  Object.keys(cache).forEach(key => delete cache[key])

/** Stringifies an object structure. */
const stringify = (data: StyleNode | StyleNode[string] | undefined) => {
  if (typeof data == "object") {
    let out = ""
    for (const p in data) out += p + stringify(data[p])
    return out
  } else {
    return String(data ?? "")
  }
}

const createClassName = (compiled: StyleNode | string) => {
  const identifier = stringify(compiled)
  return (cache[identifier] ??= toHash(identifier))
}

export type InjectionType = "class" | "global" | "keyframes"

const createStyles = (
  className: string,
  compiled: StyleNode | string,
  type: InjectionType,
) => {
  if (cache[className]) return cache[className]
  const ast =
    typeof compiled === "string" ? parser.toObject(compiled) : compiled
  return parser.toString(
    ast,
    type === "global"
      ? ""
      : type === "keyframes"
        ? "@keyframes " + className
        : "." + className,
    type,
  )
}

/**
 * Generates the needed className.
 *
 * @param compiled Css to process.
 * @param sheet StyleSheet target.
 * @param append Append or prepend.
 * @param type What kind of css needs to be injected.
 */
export const hash = (
  compiled: StyleNode | string,
  sheet: Sheet,
  append?: boolean,
  type: InjectionType = "class",
) => {
  const className = createClassName(compiled)
  const styles = createStyles(className, compiled, type)

  // If the global flag is set, save the current stringified and compiled CSS to `cache.g`
  // to allow replacing styles in <style /> instead of appending them.
  // This is required for using `createGlobalStyles` with themes
  const cssToReplace = type === "global" ? cache["g"] : undefined
  if (type === "global") cache["g"] = styles

  update(styles, sheet, append, cssToReplace)
  return className
}
