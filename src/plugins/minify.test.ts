import { describe, expect, it } from "vitest"

import { minify } from "./minify"

describe("minify plugin", () => {
  const plugin = minify()

  it("formats declarations without extra spaces", () => {
    expect(
      plugin.buildRule?.({ key: "background-color", value: "red   blue" }),
    ).toBe("background-color:red blue;")
  })

  it("builds compact style blocks", () => {
    expect(
      plugin.buildBlock?.({
        selector: ".card",
        node: {},
        content: "color:red;",
      }),
    ).toBe(".card{color:red;}")
  })
})
