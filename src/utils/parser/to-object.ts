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

/** Convert a css style string into an object. */
export const toObject = (styles: string) => {
  const tree: Tree = [{}]

  let block: ReturnType<typeof parseBlock>
  while ((block = parseBlock(styles))) {
    tree[0] ??= {}

    if (block.close) {
      tree.shift() // Remove the current entry
    } else if (block.selector) {
      tree[0][block.selector] ??= {}
      tree.unshift(tree[0][block.selector] as StyleNode)
    } else if (block.name) {
      tree[0][block.name] = clean(block.value)
    }
  }

  return tree[0] ?? {}
}
