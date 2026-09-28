import { type JSX } from "react"

import { css } from "../css"
import { recipe, type RecipeFactory } from "../recipe"
import { getSetup } from "../setup"
import { type CssTemplate, isCssTemplate } from "../utils/css-template"
import { type StyleNode } from "../utils/parser"
import { Styles } from "../utils/styles"
import { type Resolve } from "../utils/util-types"

type VNode = Iterable<VNode> | JSX.Element | string | boolean | null | undefined
interface FC<TProps = {}> {
  (props: TProps): VNode | Promise<VNode>
  displayName?: string | undefined
}

type ElementName = keyof JSX.IntrinsicElements
type ElementType = ElementName | FC<any> | SFC<any, any, any>

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
  /** @deprecated Internal prop for type preservation, don't use this in your app */
  z__defaultTypeProps?: TTypeProps
  /** @deprecated Internal prop for type preservation, don't use this in your app */
  z__styledProps?: TStyledProps
}

type SFCResult<T extends ElementType> = T extends string
  ? VNode
  : T extends FC | SFC<any, any, any>
    ? ReturnType<T>
    : never

interface SFC<
  TDefaultType extends ElementType,
  TProps extends object,
  TStyles extends Styles | ((props: TProps) => Styles),
> extends SFCMeta<PropsOf<TDefaultType>, TProps> {
  <TType extends ElementType = TDefaultType>(
    this: StyledContext<TProps> | void,
    props: StyledProps<TType, TProps>,
  ): SFCResult<TDefaultType>

  displayName: string | undefined
  filterProps: (filter: (keyof TProps)[]) => SFC<TDefaultType, TProps, TStyles>
  styles: TStyles
}

interface StyledFactory<TDefaultType extends ElementType> {
  (...args: CssTemplate["Args"]): SFC<TDefaultType, {}, Styles>

  (...args: [StyleNode]): SFC<TDefaultType, {}, Styles>

  <TProps extends object = {}>(
    ...args: [RecipeFactory<TProps>]
  ): SFC<TDefaultType, TProps, (props: TProps) => Styles>
}

const createComponent = (
  defaultType: ElementType,
  styles: Styles | ((props: object) => Styles),
) => {
  const getProps = (props: StyledProps, filterProps: string[] = []) => {
    // Set a flag if the current components had a previous className
    // similar to "go...". This is the append/prepend flag
    const prev = (props as { className?: string | undefined }).className
    const append = !!prev && / *go\d+/.test(prev)

    const className = (
      styles instanceof Styles ? styles : styles(props)
    ).withConfig({ append }).class

    const fwdProps = { ...props }
    filterProps.forEach(key => delete fwdProps[key])

    return {
      ...fwdProps,
      className: className + (prev ? ` ${prev}` : ""),
    }
  }

  function Styled(this: StyledContext | void, { as, ...props }: StyledProps) {
    return getSetup().jsx(as ?? defaultType, getProps(props, this?.filterProps))
  }

  const typeName =
    typeof defaultType === "string"
      ? defaultType
      : (defaultType.displayName ?? "")
  const displayName = "styled(" + typeName + ")"

  const create = (Component: typeof Styled) =>
    Object.assign(Component, {
      displayName,
      styles,
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
} & (<TType extends FC<any>>(type: TType) => StyledFactory<TType>)

/** Create React components that have styles attached to them. */
export const styled = new Proxy(createStyled as ProxyTarget, {
  get: (_, prop: ElementName) => createStyled(prop),
})
