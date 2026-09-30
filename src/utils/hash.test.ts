import { describe, it, expect } from "vitest"

import { hash } from "./hash"
import { getCsrSheet } from "./style-sheet"
import { toHash } from "./to-hash"

describe("Test hash", () => {
  it("hashes CSS strings and writes scoped CSS", () => {
    const className = hash("color:red;")

    expect(className).toBe(toHash("color:red;"))
    expect(getCsrSheet()?.data).toBe(`.${className}{color:red;}`)
  })

  it("hashes style objects", () => {
    const className = hash({ color: "red" })

    expect(getCsrSheet()?.data).toBe(`.${className}{color:red;}`)
  })

  it("writes keyframes without a scope selector", () => {
    const className = hash(
      { from: { opacity: 0 }, to: { opacity: 1 } },
      false,
      "keyframes",
    )

    expect(getCsrSheet()?.data).toBe(
      `@keyframes ${className}{from{opacity:0;}to{opacity:1;}}`,
    )
  })

  it("writes global styles without a selector", () => {
    hash(
      { className: { color: "red", opacity: 1, rotate: "45deg" } },
      false,
      "global",
    )

    expect(getCsrSheet()?.data).toBe(
      `className{color:red;opacity:1;rotate:45deg;}`,
    )
  })

  it("does not duplicate cached CSS", () => {
    const input = "color:green;"

    hash(input)
    hash(input)

    expect(getCsrSheet()?.data).toBe(`.${toHash(input)}{color:green;}`)
  })
})
