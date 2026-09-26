import { describe, it, expect } from "vitest"

import { getCssString, joinCssTemplate } from "./cssTemplate"
import { Styles } from "./styles"

describe("Test compile", () => {
  it.each`
    name           | value                           | result
    ${"Styles"}    | ${new Styles({ opacity: 0.5 })} | ${"opacity:0.5;"}
    ${"object"}    | ${{ color: "red" }}             | ${"color:red;"}
    ${"string"}    | ${"red"}                        | ${"red"}
    ${"number"}    | ${0.5}                          | ${"0.5"}
    ${"false"}     | ${false}                        | ${""}
    ${"null"}      | ${null}                         | ${""}
    ${"undefined"} | ${undefined}                    | ${""}
  `("Converts $name values", ({ value, result }) => {
    expect(getCssString(value)).toBe(result)
  })

  it("Converts array values", () => {
    const value = [
      new Styles({ opacity: 0.5 }),
      { color: "red" },
      "background:blue;",
    ]
    expect(getCssString(value)).toBe("opacity:0.5;color:red;background:blue;")
  })

  it.each`
    name           | strings                      | values                | result
    ${"string"}    | ${["color: ", ";"]}          | ${["red"]}            | ${"color: red;"}
    ${"object"}    | ${["background: blue;", ""]} | ${[{ color: "red" }]} | ${"background: blue;color:red;"}
    ${"number"}    | ${["opacity:", ";"]}         | ${[0.5]}              | ${"opacity:0.5;"}
    ${"false"}     | ${["a", "b"]}                | ${[false]}            | ${"ab"}
    ${"null"}      | ${["a", "b"]}                | ${[null]}             | ${"ab"}
    ${"undefined"} | ${["a", "b"]}                | ${[undefined]}        | ${"ab"}
  `("interpolates $name values", ({ strings, values, result }) => {
    expect(joinCssTemplate(strings, values)).toBe(result)
  })

  it("Interpolates multiple values", () => {
    const strings = [
      "color:red;",
      "background:",
      ";\n  border:",
      " solid black;",
    ]
    const values = [new Styles({ opacity: 0.5 }), "blue", "1px"]
    expect(joinCssTemplate(strings, ...values)).toBe(
      "color:red;opacity:0.5;background:blue;\n  border:1px solid black;",
    )
  })
})
