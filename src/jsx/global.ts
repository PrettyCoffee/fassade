import { type Styles } from "../utils/styles"

interface GlobalProps {
  styles: Styles
}

/** Injects the provided styles as global css. */
export const Global = ({ styles }: GlobalProps) => {
  // oxlint-disable-next-line no-unused-expressions
  styles.withConfig({ type: "global" }).class
  return null
}
