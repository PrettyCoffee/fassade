import { describe, expect, it } from "vitest"

import { Styles } from "./utils/styles"
import { variants, type VariantProps } from "./variants"

type Equal<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false
type Expect<T extends true> = T

describe("Test variants", () => {
  const buttonStyles = variants({
    base: { display: "inline-flex" },
    variants: {
      intent: {
        primary: { color: "white", backgroundColor: "royalblue" },
        secondary: { color: "royalblue", backgroundColor: "white" },
      },
      size: {
        small: {
          padding: "4px 8px",
          "&:hover": { transform: "translateY(-1px)" },
        },
        medium: { padding: "8px 12px" },
      },
      disabled: {
        true: { opacity: 0.5 },
        false: { opacity: 1 },
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
      disabled: false,
    },
    compoundVariants: [
      {
        intent: "primary",
        disabled: true,
        styles: { cursor: "not-allowed" },
      },
    ],
  })

  it("uses defaults and returns Styles without required props", () => {
    const result = buttonStyles()

    expect(result).toBeInstanceOf(Styles)
    expect(result.styles).toStrictEqual({
      display: "inline-flex",
      color: "white",
      backgroundColor: "royalblue",
      padding: "8px 12px",
      opacity: 1,
    })
  })

  it("uses configured defaults for undefined variant props", () => {
    const defaultStyles = buttonStyles({ intent: undefined, size: undefined })

    expect(defaultStyles.styles).toMatchObject({
      color: "white",
      backgroundColor: "royalblue",
      padding: "8px 12px",
    })
  })

  it("selects variants and matches scalar and multi-value compounds", () => {
    const result = buttonStyles({
      intent: "primary",
      size: "small",
      disabled: true,
    })

    expect(result.styles).toMatchObject({
      color: "white",
      padding: "4px 8px",
      opacity: 0.5,
      cursor: "not-allowed",
      "&:hover": { transform: "translateY(-1px)" },
    })
  })

  it("merges style arrays", () => {
    const createStyles = variants({
      base: [
        { color: "black", "&:hover": { color: "black", opacity: 0.8 } },
        new Styles({ backgroundColor: "white" }),
      ],
      variants: {
        tone: {
          warm: [
            new Styles({ color: "orange" }),
            { "&:hover": { color: "orange" } },
          ],
        },
      },
      compoundVariants: [
        {
          tone: "warm",
          styles: [{ fontWeight: "bold", "&:hover": { opacity: 0 } }],
        },
      ],
    })

    const result = createStyles({ tone: "warm" })

    expect(result.styles).toStrictEqual({
      color: "orange",
      "&:hover": { color: "orange", opacity: 0 },
      backgroundColor: "white",
      fontWeight: "bold",
    })
    expect(result.toString()).toContain("opacity:0;")
  })

  it("does not accumulate styles between calls", () => {
    const first = buttonStyles({ intent: "primary" })
    const second = buttonStyles({ intent: "secondary" })

    expect(first).not.toBe(second)
    expect(first.styles.color).toBe("white")
    expect(second.styles.color).toBe("royalblue")
  })

  it("ignores unknown props and leaves variants without defaults unselected", () => {
    const createStyles = variants({
      variants: { tone: { warm: { color: "red" } } },
    })
    const result = createStyles({ unexpected: "value" } as never)

    expect(result.styles).toStrictEqual({})
  })

  it("does not treat inherited object properties as variant selections", () => {
    const createStyles = variants({
      variants: { toString: { warm: { color: "red" } } },
    })

    expect(createStyles().styles).toStrictEqual({})
    expect(createStyles({ toString: "warm" }).styles).toStrictEqual({
      color: "red",
    })
  })

  it("infers variant props, including booleans and null opt-outs", () => {
    type Props = VariantProps<typeof buttonStyles>
    interface ExpectedProps {
      intent?: "primary" | "secondary"
      size?: "small" | "medium"
      disabled?: boolean
    }
    type InferredPropsMatch = Expect<Equal<Props, ExpectedProps>>
    const check: InferredPropsMatch = true
    const props: Props = { intent: "secondary", disabled: true }

    expect(check).toBeTruthy()
    expect(buttonStyles(props)).toBeInstanceOf(Styles)
  })
})
