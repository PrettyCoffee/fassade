import { describe, expect, it } from "vitest"

import { merge } from "./merge"

interface MergeShape {
  color?: string
  padding?: number
  background?: string
  hover?: { color?: string; opacity?: number }
  value?: string | { nested: string }
}

describe("Test merge", () => {
  it("deeply merges objects and lets later values override earlier ones", () => {
    const result = merge<MergeShape>(
      {
        color: "black",
        padding: 4,
        hover: { color: "gray", opacity: 0.8 },
      },
      {
        color: "blue",
        hover: { color: "white" },
      },
      {
        hover: { opacity: 1 },
      },
    )

    expect(result).toStrictEqual({
      color: "blue",
      padding: 4,
      hover: { color: "white", opacity: 1 },
    })
  })

  it("does not mutate the base or inserted objects", () => {
    const base = { color: "black", hover: { color: "gray" } }
    const insert = { background: "white", hover: { opacity: 0.5 } }

    const result = merge<MergeShape>(base, insert)

    expect(result).toStrictEqual({
      color: "black",
      background: "white",
      hover: { color: "gray", opacity: 0.5 },
    })
    expect(base).toStrictEqual({ color: "black", hover: { color: "gray" } })
    expect(insert).toStrictEqual({
      background: "white",
      hover: { opacity: 0.5 },
    })
    expect(result).not.toBe(base)
    expect(result.hover).not.toBe(base.hover)
    expect(result.hover).not.toBe(insert.hover)
  })

  it("clones inserted nested objects when the base has no matching key", () => {
    const nested = { color: "red" }
    const insert = { hover: nested }

    const result = merge<MergeShape>({}, insert)

    expect(result.hover).toStrictEqual({ color: "red" })
    expect(result.hover).not.toBe(nested)
  })

  it("skips false, null, and undefined insertions", () => {
    const base = { color: "black", hover: { opacity: 1 } }

    const result = merge<MergeShape>(base, false, null, undefined, {
      color: "blue",
    })

    expect(result).toStrictEqual({ color: "blue", hover: { opacity: 1 } })
  })

  it("replaces nested values when their object shape changes", () => {
    const result = merge<MergeShape>(
      { value: { nested: "before" } },
      { value: "after" },
      { value: { nested: "final" } },
    )

    expect(result).toStrictEqual({ value: { nested: "final" } })
  })
})
