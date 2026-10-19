import { extractCss } from "../extract-css"
import { getSetup } from "../setup"
import { FASSADE_ID } from "../utils/style-sheet"

/** Renders a fassade style element with the cached styles of server components. */
export const ExtractServerCss = async () =>
  getSetup().jsx("style", { id: FASSADE_ID.SSR }, await extractCss())
