import { type WithTheme, withTheme } from "./setup"
import { merge } from "./utils/merge"
import { type StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"
import { type Conditional } from "./utils/util-types"

export type RecipeFactory<TProps extends object> = (
  props: WithTheme<TProps>,
) => Conditional<Styles | StyleNode> | Conditional<Styles | StyleNode>[]

export const recipe =
  <TProps extends object>(create: RecipeFactory<TProps>) =>
  (props: TProps): Styles => {
    const array = [create(withTheme(props))]
      .flat()
      .filter(styles => !!styles)
      .map(styles => (styles instanceof Styles ? styles.styles : styles))

    return new Styles(merge(...array))
  }
