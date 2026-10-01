import { getTheme, type Theme } from "./setup"
import { merge } from "./utils/merge"
import type { StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"

type StyleInput = StyleNode | Styles | (StyleNode | Styles)[]
type VariantDefinitions = Record<string, Record<string, StyleInput>>
type VariantValue<TValue> = TValue extends "true"
  ? true
  : TValue extends "false"
    ? false
    : TValue

type GetVariantProps<TVariants extends VariantDefinitions> = {
  [TKey in keyof TVariants]?: VariantValue<keyof TVariants[TKey]>
} & {} // {} is required to improve readability of the type for users

type VariantDefaults<TVariants extends VariantDefinitions> = {
  [TKey in keyof TVariants]?: VariantValue<keyof TVariants[TKey]>
}

type AnyCompoundConditions = Record<
  string,
  string | boolean | (string | boolean)[]
>

type CompoundCondition<TOptions> =
  | VariantValue<keyof TOptions>
  | VariantValue<keyof TOptions>[]

type CompoundVariant<TVariants extends VariantDefinitions> = {
  [TKey in keyof TVariants]?: CompoundCondition<TVariants[TKey]>
} & { styles: StyleInput }

interface VariantsConfig<TVariants extends VariantDefinitions> {
  base?: StyleInput
  variants: TVariants
  defaultVariants?: VariantDefaults<TVariants>
  compoundVariants?: CompoundVariant<TVariants>[]
}

type RuntimeVariantValue = string | boolean | undefined

/** Extract the props of a variant. */
export type VariantProps<TVariantFactory> = TVariantFactory extends (
  props?: infer TProps,
) => Styles
  ? NonNullable<TProps>
  : never

const normalizeStyles = (input: StyleInput | undefined) => {
  const styles = (!input ? [] : [input].flat()).map(styles =>
    styles instanceof Styles ? styles.styles : styles,
  )
  return merge({}, ...styles)
}

const compoundMatches = (
  conditions: AnyCompoundConditions,
  props: Record<string, RuntimeVariantValue>,
) =>
  Object.entries(conditions).every(([name, condition]) => {
    const propValue = props[name]
    return Array.isArray(condition)
      ? condition.some(candidate => candidate === propValue)
      : condition === propValue
  })

const normalizeVariants = <TVariants extends VariantDefinitions>({
  variants,
}: VariantsConfig<TVariants>) =>
  Object.fromEntries(
    Object.entries(variants).map(([propName, options]) => {
      const value = Object.fromEntries(
        Object.entries(options).map(([optionName, optionStyles]) => [
          optionName,
          normalizeStyles(optionStyles),
        ]),
      )
      return [propName, value]
    }),
  )

const normalizeCompoundVariants = <TVariants extends VariantDefinitions>({
  compoundVariants,
}: VariantsConfig<TVariants>) => {
  if (!compoundVariants) return []
  return compoundVariants.map(({ styles, ...conditions }) => ({
    styles: normalizeStyles(styles),
    ...conditions,
  }))
}

const getProps = (
  userProps: Record<string, RuntimeVariantValue>,
  defaultProps: Record<string, RuntimeVariantValue>,
) => {
  const props = { ...defaultProps }
  for (const key in userProps)
    if (userProps[key] != null) props[key] = userProps[key]
  return props
}

/**
 * Create a variant based recipe, supporting base, variants, default, and
 * compound styles.
 */
export function variants<TVariants extends VariantDefinitions>(
  variantConfig:
    | VariantsConfig<TVariants>
    | ((theme: Theme) => VariantsConfig<TVariants>),
) {
  const config =
    typeof variantConfig === "function"
      ? variantConfig(getTheme())
      : variantConfig

  const defaultProps = config.defaultVariants ?? {}

  const baseStyles = normalizeStyles(config.base)
  const variants = normalizeVariants(config)
  const compounds = normalizeCompoundVariants(config)

  return (userProps: GetVariantProps<TVariants> = {}) => {
    const result = [baseStyles]

    const props = getProps(
      userProps as Record<string, RuntimeVariantValue>,
      defaultProps,
    )

    Object.entries(props).forEach(([name, value]) => {
      if (value == null) return
      const variant = variants[name]?.[String(value)]
      result.push(normalizeStyles(variant ?? {}))
    })

    compounds.forEach(({ styles, ...conditions }) => {
      if (compoundMatches(conditions as AnyCompoundConditions, props)) {
        result.push(normalizeStyles(styles))
      }
    })

    return new Styles(merge(...result))
  }
}
