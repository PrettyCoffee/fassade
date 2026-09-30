import { type StyleNode } from "./utils/parser"
import { Styles } from "./utils/styles"
import { type Conditional } from "./utils/util-types"

export type RecipeFactory<TProps extends object> = (
  props: TProps,
) => Conditional<Styles | StyleNode> | Conditional<Styles | StyleNode>[]

export function recipe<TProps extends object>(create: RecipeFactory<TProps>) {
  const result = new Styles({})
  return (props: TProps): Styles => {
    for (const style of [create(props)].flat()) {
      if (!style) continue
      result.append(style instanceof Styles ? style.styles : style)
    }
    return result
  }
}
