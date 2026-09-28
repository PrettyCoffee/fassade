import { afterEach, describe, expect, it } from "vitest"

import { createGlobalStyles } from "./create-global-styles"

describe("createGlobalStyles", () => {
  afterEach(() => {
    document.getElementById("_goobrrr")?.remove()
  })

  it("injects template styles when the component is rendered", () => {
    const GlobalStyles = createGlobalStyles`
      body {
        margin: 0;
      }
    `

    expect(document.getElementById("_goobrrr")).toBeNull()

    expect(GlobalStyles()).toBeNull()
    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      "body{margin:0;}",
    )
  })

  it("accepts style objects", () => {
    const GlobalStyles = createGlobalStyles({
      html: { fontFamily: "sans-serif" },
    })

    GlobalStyles()

    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      "html{font-family:sans-serif;}",
    )
  })
})
