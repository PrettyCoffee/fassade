import { type StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"
import { type Conditional } from "./utils/util-types"

export type RecipeFactory<TProps extends object> = (
  props: TProps,
) => Conditional<Styles | StyleNode> | Conditional<Styles | StyleNode>[]

export function recipe<TProps extends object>(create: RecipeFactory<TProps>) {
  return (props: TProps): Styles => {
    const array = [create(props)].flat()
    return array.reduce<Styles>(
      (result, styles) =>
        !styles
          ? result
          : result.append(styles instanceof Styles ? styles.styles : styles),
      new Styles({}),
    )
  }
}
