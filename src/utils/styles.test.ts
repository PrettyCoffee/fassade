import { describe, expect, it } from "vitest"

import { getCsrSheet, GOOBRRR_ID } from "./style-sheet"
import { Styles } from "./styles"

describe("Test Styles", () => {
  it("converts string to style object", () => {
    const styles = new Styles("color: rebeccapurple;")
    expect(styles.styles).toStrictEqual({ color: "rebeccapurple" })
  })

  it("injects styles lazily and caches the generated class", () => {
    const styles = new Styles({ color: "rebeccapurple" })

    expect(document.getElementById(GOOBRRR_ID.CSR)).toBeNull()

    const className = styles.class

    expect(className).toBeTruthy()
    expect(styles.class).toBe(className)
    expect(getCsrSheet()?.data).toBe(`.${className}{color:rebeccapurple;}`)
  })

  it("deeply merges appended styles", () => {
    const styles = new Styles({
      color: "red",
      "&:hover": { color: "blue", textDecoration: "underline" },
    })

    const appended = styles.append({
      backgroundColor: "white",
      "&:hover": { color: "green" },
    })

    expect(appended.styles).toStrictEqual({
      color: "red",
      backgroundColor: "white",
      "&:hover": { color: "green", textDecoration: "underline" },
    })
    expect(appended.toString()).toBe(
      "color:red;background-color:white;&:hover{color:green;text-decoration:underline;}",
    )
  })

  it("creates a new instance with overridden configuration", () => {
    const styles = new Styles({ body: { margin: 0 } })
    const global = styles.withConfig({ type: "global", append: true })

    expect(global).not.toBe(styles)
    expect(global.styles).toBe(styles.styles)
    global.inject()
    expect(getCsrSheet()?.data).toBe("body{margin:0;}")
  })

  it("converts styles to a CSS string without injecting them", () => {
    const styles = new Styles({ color: "red", "&:focus": { outline: "none" } })

    expect(styles.toString()).toBe("color:red;&:focus{outline:none;}")
    expect(document.getElementById(GOOBRRR_ID.CSR)).toBeNull()
  })
})
