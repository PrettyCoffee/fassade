import { type StyleNode } from "./core/parser"
import { Styles } from "./core/styles"
import { type Conditional } from "./util-types"

export type RecipeFactory<TProps extends object> = (
  props: TProps,
) => Conditional<Styles | StyleNode> | Conditional<Styles | StyleNode>[]

export function recipe<TProps extends object>(create: RecipeFactory<TProps>) {
  return (props: TProps): Styles => {
    const result = new Styles({})
    for (const style of [create(props)].flat()) {
      if (!style) continue
      result.append(style instanceof Styles ? style.styles : style)
    }
    return result
  }
}
