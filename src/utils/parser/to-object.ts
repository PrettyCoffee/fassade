import { type StyleNode } from "./types"

const newRule =
  /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g
const ruleClean = /\/\*[^]*?\*\/|  +/g
const ruleNewline = /\n+/g

const clean = (string: string) => string.replaceAll(ruleNewline, " ").trim()

const parseBlock = (val: string) => {
  const [, name, value, open, close] =
    newRule.exec(val.replaceAll(ruleClean, "")) ?? []

  if (close) return { close }
  if (open) return { selector: clean(open) }
  if (name && value) return { name, value }
  return null
}

type Tree = (StyleNode | undefined)[]

const getNextKey = (key: string, tree: Tree) => {
  const node = tree[0]
  if (!node?.[key]) return key

  let nextKey = key
  for (let index = 0; node[nextKey]; index++) nextKey = `${key}\0${index}`
  return nextKey
}

/** Convert a css style string into an object. */
export const toObject = (styles: string) => {
  const tree: Tree = [{}]

  let block: ReturnType<typeof parseBlock>
  while ((block = parseBlock(styles))) {
    tree[0] ??= {}

    if (block.close) {
      tree.shift() // Remove the current entry
    } else if (block.selector) {
      const selector = getNextKey(block.selector, tree)
      tree[0][selector] ??= {}
      tree.unshift(tree[0][selector] as StyleNode)
    } else if (block.name) {
      const name = getNextKey(block.name, tree)
      tree[0][name] = clean(block.value)
    }
  }

  return tree[0] ?? {}
}
