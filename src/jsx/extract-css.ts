import { extractCss } from "../extract-css"
import { getSetup } from "../setup"
import { FASSADE_ID } from "../utils/style-sheet"

/** Renders a fassade style element with the cached styles. */
export const ExtractCss = async () =>
  getSetup().jsx("style", { id: FASSADE_ID.SSR }, await extractCss())
