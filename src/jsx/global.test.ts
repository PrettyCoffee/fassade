import { describe, expect, it } from "vitest"

import { css } from "../css"
import { getCsrSheet, GOOBRRR_ID } from "../utils/style-sheet"
import { Global } from "./global"

describe("Test Global", () => {
  it("injects template styles when the component is rendered", () => {
    const styles = css`
      body {
        margin: 0;
      }
    `

    expect(document.getElementById(GOOBRRR_ID.CSR)).toBeNull()
    expect(Global({ styles })).toBeNull()
    expect(getCsrSheet()?.data).toBe("body{margin:0;}")
  })

  it("accepts style objects", () => {
    const styles = css({
      html: { fontFamily: "sans-serif" },
    })

    Global({ styles })

    expect(getCsrSheet()?.data).toBe("html{font-family:sans-serif;}")
  })
})
