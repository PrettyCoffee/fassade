import { describe, expect, it } from "vitest"

import { getCsrSheet, GOOBRRR_ID } from "../utils/style-sheet"
import { createGlobalStyles } from "./create-global-styles"

describe("createGlobalStyles", () => {
  it("injects template styles when the component is rendered", () => {
    const GlobalStyles = createGlobalStyles`
      body {
        margin: 0;
      }
    `

    expect(document.getElementById(GOOBRRR_ID.CSR)).toBeNull()
    expect(GlobalStyles()).toBeNull()
    expect(getCsrSheet().data).toBe("body{margin:0;}")
  })

  it("accepts style objects", () => {
    const GlobalStyles = createGlobalStyles({
      html: { fontFamily: "sans-serif" },
    })

    GlobalStyles()

    expect(getCsrSheet().data).toBe("html{font-family:sans-serif;}")
  })
})
