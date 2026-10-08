import { globalStyles } from "demo-lib/components"
import { Global } from "demo-lib/goobrrr"

import { ExtractCss } from "./goobrrr"

export const GlobalStyles = () => (
  <>
    <Global styles={globalStyles} />
    <ExtractCss />
  </>
)
