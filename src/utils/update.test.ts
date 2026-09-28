import { describe, it, expect } from "vitest"

import { update } from "./update"

describe("update", () => {
  it("appends css by default", () => {
    const sheet = { data: "old;" }

    update("new;", sheet)

    expect(sheet.data).toBe("old;new;")
  })

  it("prepends css when append is true", () => {
    const sheet = { data: "old;" }

    update("new;", sheet, true)

    expect(sheet.data).toBe("new;old;")
  })

  it("does not add duplicate css", () => {
    const sheet = { data: "old;" }

    update("old;", sheet)

    expect(sheet.data).toBe("old;")
  })

  it("replaces previously generated css", () => {
    const sheet = { data: "old;other;" }

    update("new;", sheet, false, "old;")

    expect(sheet.data).toBe("new;other;")
  })
})
