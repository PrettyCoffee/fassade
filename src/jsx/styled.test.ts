import { beforeEach, describe, expect, it, vi } from "vitest"

import { setup, type Theme } from "../setup"
import { styled } from "./styled"

describe("Test styled", () => {
  const jsx = vi.fn(
    (type: unknown, props?: object | null, ...children: unknown[]) =>
      ({ type, props, children }) as never,
  )

  beforeEach(() => {
    jsx.mockClear()
    setup({ jsx })
  })

  it("creates a component for an intrinsic element with generated styles", () => {
    const Button = styled.button`
      color: red;
    `

    Button({ id: "save", className: "external" })

    expect(jsx).toHaveBeenCalledOnce()
    expect(jsx).toHaveBeenCalledWith(
      "button",
      expect.objectContaining({
        id: "save",
        className: expect.stringMatching(/^go\d+ external$/),
      }),
    )
  })

  it("allows the rendered element to be overridden with as", () => {
    const CustomButton = (props: { type: string }) => props.type
    const Button = styled.button({ color: "red" })

    Button({ as: CustomButton, type: "button" })

    expect(jsx).toHaveBeenCalledWith(CustomButton, {
      className: expect.stringMatching(/^go\d+$/),
      type: "button",
    })
  })

  it("uses recipe props to create styles and forwards those props", () => {
    const Banner = styled.div<{ tone: string }>(({ tone }) => ({ color: tone }))

    Banner({ tone: "tomato", title: "Notice" })

    expect(jsx).toHaveBeenCalledWith(
      "div",
      expect.objectContaining({
        tone: "tomato",
        title: "Notice",
        className: expect.stringMatching(/^go\d+$/),
      }),
    )
  })

  it("removes filtered props before rendering", () => {
    const Input = styled
      .input<{ secret: string }>(() => ({ color: "red" }))
      .filterProps(["secret"])

    Input({ id: "email", secret: "private" })

    expect(jsx).toHaveBeenCalledWith(
      "input",
      expect.not.objectContaining({ secret: "private" }),
    )
    expect(jsx).toHaveBeenCalledWith(
      "input",
      expect.objectContaining({ id: "email" }),
    )
  })

  it("provides a theme to styled components", () => {
    const theme = { color: "blue" } as Theme
    setup({ theme })
    const mock = vi.fn()
    styled.button(mock)({})

    expect(mock).toHaveBeenCalledWith({}, theme)
  })

  it("exposes a display name and the styles used by the component", () => {
    const Button = styled.button({ color: "red" })

    expect(Button.displayName).toBe("styled(button)")
    expect(Button.styles({}).toString()).toBe("color:red;")
  })

  it("extends styles of ancestor", () => {
    const First = styled.button<{ kind: "primary" | "secondary" }>(
      ({ kind }) => ({
        color: kind === "primary" ? "red" : "gray",
        fontSize: "8px",
        border: "1px solid black",
      }),
    )
    First.displayName = "First"
    const Second = styled(First)<{ borderColor: string }>(
      ({ borderColor }) => ({
        fontSize: "10px",
        border: `1px solid ${borderColor}`,
      }),
    )

    expect(Second.displayName).toBe("styled(First)")
    expect(
      Second.styles({ kind: "primary", borderColor: "purple" }).toString(),
    ).toBe("color:red;font-size:10px;border:1px solid purple;")
    expect(
      Second.styles({ kind: "secondary", borderColor: "rose" }).toString(),
    ).toBe("color:gray;font-size:10px;border:1px solid rose;")
  })
})
