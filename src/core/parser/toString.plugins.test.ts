import { afterEach, describe, expect, it, vi } from "vitest"

import { minify } from "../../plugins/minify"
import { type Plugin } from "../../plugins/plugin"
import { strict } from "../../plugins/strict"
import { setup } from "../../setup"
import { toString } from "./toString"

afterEach(() => {
  vi.restoreAllMocks()
  setup({ plugins: [minify()] })
})

describe("Test plugin integration", () => {
  it("uses configured plugins to stringify keyframes", () => {
    setup({ plugins: [minify()] })

    expect(
      toString(
        { from: { opacity: 0 }, to: { opacity: 1 } },
        "@keyframes fade",
        "keyframes",
      ),
    ).toBe("@keyframes fade{from{opacity:0;}to{opacity:1;}}")
  })

  it("allows keyframes only when using the keyframes injection type", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    setup({ plugins: [minify(), strict()] })
    const frames = { from: { opacity: 0 } }

    expect(() => toString(frames, "@keyframes fade", "class")).toThrow(
      "goobrrr strict mode reported an error",
    )
    expect(toString(frames, "@keyframes fade", "keyframes")).toBe(
      "@keyframes fade{from{opacity:0;}}",
    )
  })

  it("runs hooks in order and forwards results", () => {
    const calls: string[] = []
    const first: Plugin = {
      name: "first",
      start: () => {
        calls.push("first:start")
        return { from: { opacity: 1 } }
      },
      buildRule: ({ key, value }) => {
        calls.push("first:rule")
        return `${key}:${value};`
      },
      buildBlock: ({ selector, content }) => {
        calls.push(`first:block:${selector}`)
        return `${selector}{${content}}`
      },
      end: ({ result }) => {
        calls.push("first:end")
        return `${result}/*first*/`
      },
    }
    const second: Plugin = {
      name: "second",
      start: ({ result }) => {
        calls.push("second:start")
        expect(result).toStrictEqual({ from: { opacity: 1 } })
      },
      buildRule: ({ result }) => {
        calls.push("second:rule")
        expect(result).toBe("opacity:1;")
      },
      buildBlock: ({ selector, result }) => {
        calls.push(`second:block:${selector}`)
        expect(result).toBe(
          selector === "from"
            ? "from{opacity:1;}"
            : "@keyframes fade{from{opacity:1;}}",
        )
      },
      end: ({ result }) => {
        calls.push("second:end")
        expect(result).toBe("@keyframes fade{from{opacity:1;}}/*first*/")
      },
    }

    setup({ plugins: [first, second] })

    expect(
      toString({ from: { opacity: 0 } }, "@keyframes fade", "keyframes"),
    ).toBe("@keyframes fade{from{opacity:1;}}/*first*/")
    expect(calls).toEqual([
      "first:start",
      "second:start",
      "first:rule",
      "second:rule",
      "first:block:from",
      "second:block:from",
      "first:block:@keyframes fade",
      "second:block:@keyframes fade",
      "first:end",
      "second:end",
    ])
  })
})
