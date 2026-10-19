import { use } from "react"

import { extractCss } from "../extract-css"
import { getSetup } from "../setup"
import { getWindow } from "../utils/get-window"
import { FASSADE_ID, getCsrSheet } from "../utils/style-sheet"

let promise: Promise<string> | null = null

/**
 * Renders a fassade style element with the cached styles of client components.
 *
 * Must be wrapped in a client component, to extract styles when prerendering
 * client components.
 *
 * @example
 *   "use client"
 *   import { ExtractClientCss as ExtractCss } from "#lib/fassade"
 *   export const ExtractClientCss = () => <ExtractCss />
 */
export const ExtractClientCss = () => {
  const css = getWindow()
    ? getCsrSheet()?.data // browser: read from DOM
    : use((promise ??= extractCss())) // prerender: collect extracted styles

  return getSetup().jsx("style", { id: FASSADE_ID.CSR }, css)
}
