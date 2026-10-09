import { afterEach, describe, expect, it, vi } from "vitest"

import { strict } from "./strict"

describe("strict plugin", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    [
      "empty rule key",
      (plugin: ReturnType<typeof strict>) =>
        plugin.buildRule?.({ key: " ", value: "red" }),
    ],
    [
      "empty rule value",
      (plugin: ReturnType<typeof strict>) =>
        plugin.buildRule?.({ key: "color", value: " \n" }),
    ],
    [
      "empty block selector",
      (plugin: ReturnType<typeof strict>) =>
        plugin.buildBlock?.({ selector: " ", node: {}, content: "color:red;" }),
    ],
    [
      "empty block content",
      (plugin: ReturnType<typeof strict>) =>
        plugin.buildBlock?.({ selector: ".card", node: {}, content: " \n" }),
    ],
    [
      "keyframes in a non-keyframes injection",
      (plugin: ReturnType<typeof strict>) =>
        plugin.buildBlock?.({
          selector: "@keyframes fade",
          node: {},
          content: "from{opacity:0;}",
          injection: "class",
        }),
    ],
  ])("throws for %s by default", (_name, violate) => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => violate(strict())).toThrow(
      "fassade strict mode reported an error",
    )
  })

  it("warns instead of throwing when a rule uses warn severity", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const plugin = strict({ noEmptyRuleValue: "warn" })

    expect(() => plugin.buildRule?.({ key: "color", value: " " })).not.toThrow()
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Rule value is empty"),
      { key: "color", value: " " },
    )
  })

  it("does not report a violation when a rule is off", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const plugin = strict({ noEmptyRuleValue: "off" })

    expect(() => plugin.buildRule?.({ key: "color", value: " " })).not.toThrow()
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })
})
