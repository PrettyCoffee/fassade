import { getTheme, type Theme } from "./setup"
import { merge } from "./utils/merge"
import { type StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"
import { type Conditional } from "./utils/util-types"

export type RecipeFactory<TProps extends object> = (
  props: TProps,
  theme: Theme,
) => Conditional<Styles | StyleNode> | Conditional<Styles | StyleNode>[]

export function recipe<TProps extends object>(create: RecipeFactory<TProps>) {
  return (props: TProps): Styles => {
    const array = [create(props, getTheme())]
      .flat()
      .map(styles => (styles instanceof Styles ? styles.styles : styles))
    return new Styles(merge(...array))
  }
}
