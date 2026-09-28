import { describe, it, expect } from "vitest"

import { toHash } from "./to-hash"

describe("Test toHash", () => {
  it("returns the initial hash for an empty string", () => {
    expect(toHash("")).toBe("go11")
  })

  it("returns a deterministic class name", () => {
    expect(toHash("color:red;")).toBe(toHash("color:red;"))
    expect(toHash("color:red;")).toMatch(/^go\d+$/)
  })

  it("distinguishes different input strings", () => {
    expect(toHash("color:red;")).not.toBe(toHash("color:blue;"))
  })
})
