import { type StyleNode } from "./types"

const atRuleName = String.raw`@[\w-]+(?= )`
const propertyName = String.raw`[\u0080-\uFFFF\w%-]+(?= *:)`
const declaration = String.raw`(?<name>${atRuleName}|${propertyName}) *:? *(?<value>[^{;]+?)(?:;|(?=}|$))`
const block = String.raw`(?<selector>[^;}{]*?) *{`
const closingBrace = String.raw`(?<closingBrace>}\s*)`
const token = new RegExp(`${declaration}|${block}|${closingBrace}`, "g")
const commentsAndExtraSpaces = /\/\*[^]*?\*\/|  +/g
const newlines = /\n+/g

const collapseWhitespace = (string: string) =>
  string.replaceAll(newlines, " ").trim()

const warn = (message: string, source: string) => {
  const snippet = source.trim().replaceAll(/\s+/g, " ").slice(0, 80)
  console.warn(`[fassade]: ${message}: ${snippet}`)
}

const uniqueKey = (key: string, node: StyleNode) => {
  if (!node[key]) return key
  let nextKey = key
  // The serializer removes this suffix when emitting CSS.
  for (let index = 0; node[nextKey]; index++) nextKey = `${key}\0${index}`
  return nextKey
}

/** Convert a css style string into an object. */
export const toObject = (styles: string) => {
  const root: StyleNode = {}
  const parents: StyleNode[] = []
  let current = root
  const css = styles.replaceAll(commentsAndExtraSpaces, "")

  for (const match of css.matchAll(token)) {
    const { name, value, selector, closingBrace } = match.groups ?? {}
    if (closingBrace) {
      const parent = parents.pop()
      if (parent) current = parent
      else warn("Unexpected closing brace", closingBrace)
    } else if (selector) {
      const key = uniqueKey(collapseWhitespace(selector), current)
      const child: StyleNode = {}
      current[key] = child
      parents.push(current)
      current = child
    } else if (name && value) {
      current[uniqueKey(name, current)] = collapseWhitespace(value)
    }
  }

  // Text left after tokenizing is unrecognized CSS syntax.
  const leftover = css.replaceAll(token, "").trim()
  if (leftover) warn("Unexpected CSS syntax", leftover)
  if (parents.length > 0) warn("Unclosed block", styles)

  return root
}
