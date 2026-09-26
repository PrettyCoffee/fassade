import { beforeEach, describe, expect, it, vi } from "vitest"

import { setup } from "./setup"
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
    const CustomButton = (props: { type: string }) => null
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

  it("exposes a display name and the styles used by the component", () => {
    const Button = styled.button({ color: "red" })

    expect(Button.displayName).toBe("styled(button)")
    expect(Button.styles.toString()).toBe("color:red;")
  })
})
