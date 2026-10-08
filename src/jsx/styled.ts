import { type JSX } from "react"

import { css } from "../css"
import { recipe, type RecipeFactory } from "../recipe"
import { getSetup } from "../setup"
import { type CssTemplate, isCssTemplate } from "../utils/css-template"
import { merge } from "../utils/merge"
import { type StyleNode } from "../utils/parser"
import { Styles } from "../utils/styles"
import { type Resolve } from "../utils/util-types"

type VNode = Iterable<VNode> | JSX.Element | string | boolean | null | undefined
interface FC<TProps = {}> {
  (props: TProps): VNode | Promise<VNode>
  displayName?: string | undefined
}

type ElementName = keyof JSX.IntrinsicElements
type ElementType = ElementName | FC<any> | SFC<any, any>

type StylePropsOf<T extends ElementType> =
  T extends SFCMeta<any, infer TProps> ? TProps : {}

type PropsOf<T extends ElementType> =
  T extends SFCMeta<infer TTypeProps, infer TProps>
    ? TProps & TTypeProps
    : T extends FC<infer TProps>
      ? TProps
      : T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : never

interface StyledContext<TProps extends object = object> {
  filterProps: (keyof TProps)[]
}

type StyledProps<
  TType extends ElementType = ElementType,
  TProps extends object = object,
> = Resolve<{ as?: TType } & TProps & Omit<PropsOf<TType>, "as">>

interface SFCMeta<TTypeProps extends object, TStyledProps extends object> {
  /** @internal Internal flag to identify styled function components */
  _isSfc: true
  /** @internal Internal prop for type preservation, don't use this in your app */
  _defaultTypeProps?: TTypeProps
  /** @internal Internal prop for type preservation, don't use this in your app */
  _styledProps?: TStyledProps
}

type SFCResult<T extends ElementType> = T extends string
  ? VNode
  : T extends FC | SFC<any, any>
    ? ReturnType<T>
    : never

interface SFC<
  TDefaultType extends ElementType,
  TProps extends object,
> extends SFCMeta<PropsOf<TDefaultType>, TProps> {
  <TType extends ElementType = TDefaultType>(
    this: StyledContext<TProps> | void,
    props: StyledProps<TType, TProps>,
  ): SFCResult<TDefaultType>

  displayName: string | undefined
  filterProps: (filter: (keyof TProps)[]) => SFC<TDefaultType, TProps>
  styles: (props: TProps & StylePropsOf<TDefaultType>) => Styles
}

interface StyledFactory<TDefaultType extends ElementType> {
  (...args: CssTemplate["Args"]): SFC<TDefaultType, {}>

  (...args: [StyleNode]): SFC<TDefaultType, {}>

  <TProps extends object = {}>(
    ...args: [RecipeFactory<TProps & StylePropsOf<TDefaultType>>]
  ): SFC<TDefaultType, TProps>
}

const stylesWithProps = (
  styles: Styles | ((props: StyledProps) => Styles) | null,
  props: StyledProps,
) => (!styles ? null : styles instanceof Styles ? styles : styles(props))

const isSfc = (type: ElementType): type is SFC<any, any> =>
  typeof type === "function" && "_isSfc" in type && type._isSfc

const getStylesFromType = (type: ElementType) => {
  if (!isSfc(type)) return null
  return type.styles as Styles | ((props: StyledProps) => Styles)
}

const mergeCache: Record<string, [string, string]> = {}

const createComponent = (
  defaultType: ElementType,
  styles: Styles | ((props: object) => Styles),
) => {
  const getStyles = (props: object, as = defaultType) => {
    const base = stylesWithProps(getStylesFromType(as), props)
    const next = stylesWithProps(styles, props)
    const merged = new Styles(merge(base?.styles ?? {}, next?.styles ?? {}))
    return { base, next, merged }
  }

  const injectCss = (props: StyledProps, type: ElementType) => {
    const prev = (props as { className?: string | undefined }).className ?? ""

    const classList = prev.split(/\s+/).flatMap(name => {
      const trimmed = name.trim()
      return trimmed ? [trimmed] : []
    })

    const styles = getStyles(props, type)

    const baseClass = styles.base?.class ?? ""
    const nextClass = styles.next?.class ?? ""
    const mergedClass = styles.merged.class

    if (baseClass && nextClass) {
      mergeCache[mergedClass] = [baseClass, nextClass]
    }

    // a previously merged class might have already included these styles through styled(ThisComponent)
    const alreadyIncludesStyles = classList.some(name => {
      const existing = mergeCache[name]
      return existing?.includes(nextClass)
    })

    return alreadyIncludesStyles
      ? prev
      : [styles.merged.inject(), ...classList].join(" ")
  }

  function Styled(this: StyledContext | void, { as, ...props }: StyledProps) {
    const type = as ?? defaultType

    const fwdProps = { ...props }
    this?.filterProps.forEach(key => delete fwdProps[key])

    return getSetup().jsx(type, {
      ...fwdProps,
      className: injectCss(props, type),
    })
  }

  const typeName =
    typeof defaultType === "string"
      ? defaultType
      : (defaultType.displayName ?? "")
  const displayName = "styled(" + typeName + ")"

  const create = (Component: typeof Styled) =>
    Object.assign(Component, {
      _isSfc: true,
      displayName,
      styles: (props: object) => getStyles(props).merged,
      filterProps: (filterProps: (keyof object)[]) =>
        create(Component.bind({ filterProps })),
    })

  return create(Styled)
}

function createStyled<TDefaultType extends ElementType>(
  defaultType: TDefaultType,
) {
  const factory = (
    ...[styles, ...values]:
      | CssTemplate["Args"]
      | [RecipeFactory<any>]
      | [StyleNode]
  ) => {
    const resolvedStyles =
      typeof styles === "function"
        ? recipe(styles)
        : isCssTemplate(styles)
          ? css(styles, ...values)
          : css(styles)
    return createComponent(defaultType, resolvedStyles)
  }

  return factory as StyledFactory<TDefaultType>
}

type ProxyTarget = {
  [TKey in ElementName]: StyledFactory<TKey>
} & (<TType extends FC<any> | SFC<any, any>>(
  type: TType,
) => StyledFactory<TType>)

/** Create React components that have styles attached to them. */
export const styled = new Proxy(createStyled as ProxyTarget, {
  get: (_, prop: ElementName) => createStyled(prop),
})
