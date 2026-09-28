import { extractCss } from "../extract-css"
import { getSetup } from "../setup"
import { GOOBRRR_ID } from "../utils/style-sheet"

/** Renders a goober style element with the cached styles. */
export const ExtractCss = async () =>
  getSetup().jsx("style", { id: GOOBRRR_ID.SSR }, await extractCss())
