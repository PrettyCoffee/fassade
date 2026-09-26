import { describe, expect, it } from "vitest"

import { pretty } from "./pretty"

describe("pretty plugin", () => {
  const plugin = pretty()

  it("formats declarations with CSS punctuation", () => {
    expect(plugin.buildRule?.({ key: "color", value: "red" })).toBe(
      "color: red;",
    )
  })

  it("formats style blocks with spacing", () => {
    expect(
      plugin.buildBlock?.({
        selector: ".card",
        node: {},
        content: "color: red;",
      }),
    ).toBe(".card {color: red;}")
  })

  it("indents the completed stylesheet", () => {
    expect(
      plugin.end?.({
        result: ".card{color: red;background-color: blue;}",
      }),
    ).toBe("\n.card {\n  color: red;\n  background-color: blue;\n}\n")
  })
})
