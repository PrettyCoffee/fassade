import { afterEach, describe, expect, it } from "vitest"

import { css, glob, keyframes } from "./css"
import { Styles } from "./utils/styles"

describe("Test css", () => {
  afterEach(() => {
    document.getElementById("_goobrrr")?.remove()
  })

  it("creates Styles from an object", () => {
    const styles = css({ color: "red", marginTop: 0 })

    expect(styles).toBeInstanceOf(Styles)
    expect(styles.styles).toStrictEqual({ color: "red", marginTop: 0 })
    expect(styles.toString()).toBe("color:red;margin-top:0;")
  })

  it("creates Styles from a template", () => {
    const color = "red"
    const styles = css`
      color: ${color};
      &:hover {
        opacity: 0.8;
      }
    `

    expect(styles).toBeInstanceOf(Styles)
    expect(styles.toString()).toBe("color:red;&:hover{opacity:0.8;}")
  })

  it("injects regular styles only when the class is accessed", () => {
    const styles = css({ color: "red" })

    expect(document.getElementById("_goobrrr")).toBeNull()

    const className = styles.class

    expect(className).toBeTruthy()
    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      `.${className}{color:red;}`,
    )
  })
})

describe("Test glob", () => {
  afterEach(() => {
    document.getElementById("_goobrrr")?.remove()
  })

  it("creates global styles", () => {
    // oxlint-disable-next-line no-unused-expressions
    glob`
      body {
        margin: 0;
      }
    `

    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      "body{margin:0;}",
    )
  })

  it("creates multiple global font-faces", () => {
    // oxlint-disable-next-line no-unused-expressions
    glob`
      @font-face {
        font-family: "Noto Serif";
        font-style: normal;
      }
      @font-face {
        font-family: "Noto Serif";
        font-style: italic;
      }
    `

    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      '@font-face{font-family:"Noto Serif";font-style:normal;}@font-face{font-family:"Noto Serif";font-style:italic;}',
    )
  })
})

describe("Test keyframes", () => {
  afterEach(() => {
    document.getElementById("_goobrrr")?.remove()
  })

  it("creates keyframes", () => {
    const animationName = keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `

    expect(animationName).toBeTruthy()
    expect(document.getElementById("_goobrrr")?.textContent.trim()).toBe(
      `@keyframes ${animationName}{from{opacity:0;}to{opacity:1;}}`,
    )
  })
})
