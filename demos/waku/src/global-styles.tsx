import { globalStyles } from "demo-lib/components"
import { Global } from "demo-lib/fassade"

import { ExtractCss } from "./fassade"

export const GlobalStyles = () => (
  <>
    <Global styles={globalStyles} />
    <ExtractCss />
  </>
)
