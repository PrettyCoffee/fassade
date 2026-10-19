import { globalStyles } from "demo-lib/components"
import { Global } from "demo-lib/fassade"

import { ExtractClientCss } from "./extract-client-css"
import { ExtractServerCss } from "./fassade"

export const GlobalStyles = () => (
  <>
    <Global styles={globalStyles} />
    <ExtractServerCss />
    <ExtractClientCss />
  </>
)
