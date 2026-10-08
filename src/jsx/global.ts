import { type Styles } from "../utils/styles"

interface GlobalProps {
  styles: Styles
}

/** Injects the provided styles as global css. */
export const Global = ({ styles }: GlobalProps) => {
  styles.withConfig({ type: "global" }).inject()
  return null
}
