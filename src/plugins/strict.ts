import { type Plugin } from "./plugin"

const isEmpty = (string = "") => !string.replaceAll(/\s+/gm, "")

const warn = (ctx: unknown, message: string) => {
  console.warn(`[goobrrr strict mode]: ${message} \nContext:`, ctx)
}
const error = (ctx: unknown, message: string) => {
  console.error(`${message} \nContext:`, ctx)
  throw new Error("goobrrr strict mode reported an error")
}
const report = { warn, error, off: () => null }

type Severity = "off" | "warn" | "error"
interface Rules {
  noEmptyRuleValue?: Severity
  noEmptyRuleKey?: Severity
  noEmptyBlockContent?: Severity
  noEmptyBlockSelector?: Severity
  preferKeyframesUtility?: Severity
}

const defaultRules: Required<Rules> = {
  noEmptyRuleValue: "error",
  noEmptyRuleKey: "error",
  noEmptyBlockContent: "error",
  noEmptyBlockSelector: "error",
  preferKeyframesUtility: "error",
}

/**
 * Throw errors when detecting issues in rules or blocks (i.e. when rule values
 * are empty)
 */
export const strict = (rulesProp: Rules = {}): Plugin => {
  const rules = { ...defaultRules, ...rulesProp }
  return {
    name: "strict",
    buildRule: ctx => {
      if (isEmpty(ctx.key)) {
        report[rules.noEmptyRuleKey](ctx, "Rule key is empty")
      }
      if (isEmpty(ctx.value)) {
        report[rules.noEmptyRuleValue](ctx, "Rule value is empty")
      }
    },

    buildBlock: ctx => {
      if (isEmpty(ctx.selector)) {
        report[rules.noEmptyBlockSelector](ctx, "Block selector is empty")
      }
      if (isEmpty(ctx.content)) {
        report[rules.noEmptyBlockContent](ctx, "Block content is empty")
      }
      if (
        ctx.injection !== "keyframes" &&
        ctx.selector.startsWith("@keyframes")
      ) {
        report[rules.preferKeyframesUtility](
          ctx,
          "@keyframes should not be used in styles. Use the keyframes utility instead.",
        )
      }
    },
  }
}
