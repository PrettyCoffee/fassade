// oxlint-disable no-use-before-define -- cannot be enforced for this file, since the functions are formatting recursively
import type { Plugin } from "../../plugins/plugin"
import { getSetup } from "../../setup"
import { type InjectionType } from "../hash"
import { type StyleNode } from "./types"

interface HookContext {
  injection?: InjectionType
}

type HookHandler<THookName extends keyof Plugin> = Exclude<
  NonNullable<Plugin[THookName]>,
  string
>
type HookProps<THookName extends keyof Plugin> = Parameters<
  HookHandler<THookName>
>[0]
type HookResult<THookName extends keyof Plugin> = ReturnType<
  HookHandler<THookName>
>

const runHook = <THookName extends keyof Plugin>(
  hook: THookName,
  props: HookProps<THookName>,
  ctx: HookContext,
) => {
  const hooks = getSetup().plugins.map(
    plugin => plugin[hook] as HookHandler<THookName> | undefined,
  )
  const out = hooks.reduce(
    (props, hook) => {
      // oxlint-disable-next-line typescript/no-unsafe-argument -- type of args already ensures the correct type here
      props.result = hook?.(props as any) ?? props.result
      return props
    },
    { ...props, ...ctx },
  )

  return out.result as HookResult<THookName>
}

const isAst = (value: StyleNode | string): value is StyleNode =>
  !!value && typeof value === "object"
const isString = (value: StyleNode | string): value is string =>
  typeof value === "string"

interface Insert {
  prepend: (string: string) => void
  line: (string: string) => void
  block: (string: string, hoist: string[]) => void
}

type Parser<TValue> = (
  key: string,
  value: TValue,
  insert: Insert,
  ctx: HookContext,
) => void

type Matcher = { matcher: RegExp } & (
  | { type: "string"; handler: Parser<string> }
  | { type: "ast"; handler: Parser<StyleNode> }
)

const matchers: Matcher[] = [
  {
    matcher: /^@import/,
    type: "string",
    handler(key, value) {
      throw new Error(
        `CSS imports are not supported by fassade.\nImport: ${key} ${value}`,
      )
    },
  },
  {
    matcher: /^(@keyframes|@font-face)/,
    type: "ast",
    handler(key, value, insert, ctx) {
      const { content } = build(value, ctx)
      const selector = key.split("\0")[0] ?? ""
      insert.prepend(
        runHook("buildBlock", { selector, node: value, content }, ctx) ?? "",
      )
    },
  },
  {
    matcher: /^(?!@import|@keyframes|@font-face)/,
    type: "ast",
    handler(key, value, insert, ctx) {
      const { hoisted, content } = build(value, ctx)
      const selector = key.split("\0")[0] ?? ""
      insert.block(
        runHook("buildBlock", { selector, node: value, content }, ctx) ?? "",
        hoisted,
      )
    },
  },
  {
    matcher: /^[^@]/,
    type: "string",
    handler(jsKey, value, insert, ctx) {
      // Preserve CSS variable names
      const key = jsKey.startsWith("--")
        ? jsKey
        : (jsKey.split("\0")[0]?.replaceAll(/[A-Z]/g, "-$&").toLowerCase() ??
          "")

      insert.line(runHook("buildRule", { key, value }, ctx) ?? "")
    },
  },
]

const build = (obj: StyleNode, ctx: HookContext) => {
  const hoisted: string[] = []
  let current = ""
  const blocks: string[] = []

  const insert = {
    prepend: (value: string) => hoisted.push(value),
    block: (block: string, hoist: string[]) => {
      blocks.push(block)
      hoisted.push(...hoist)
    },
    line: (line?: string) => (current += line),
  }

  Object.entries(obj).forEach(([key, raw]) => {
    const value = typeof raw === "number" ? String(raw) : raw

    const rule = matchers.find(({ matcher, type }) => {
      if (!matcher.test(key)) return false
      return (
        (type === "ast" && isAst(value)) ||
        (type === "string" && isString(value))
      )
    })

    if (!rule) {
      throw new Error("Parser error in fassade occured")
    }

    rule.handler(
      key,
      value as string & StyleNode, // type validation is handled above
      insert,
      ctx,
    )
  })

  const content = [current, ...blocks].join("")
  return { hoisted, content }
}

export const toString = (
  node: StyleNode,
  selector?: string,
  type?: InjectionType,
) => {
  const ctx: HookContext = { injection: type }
  const tree = runHook("start", { selector, node }, ctx) ?? node
  const { hoisted, content } = build(
    !selector ? tree : { [selector]: tree },
    ctx,
  )
  return runHook("end", { result: `${hoisted.join("")}${content}` }, ctx) ?? ""
}
