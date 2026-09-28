import { describe, expect, it, vi } from "vitest"

import { css } from "./css"
import { recipe } from "./recipe"
import { Styles } from "./utils/styles"

describe("Test recipe", () => {
  it("passes props to the factory and returns its styles", () => {
    const create = vi.fn(({ tone }: { tone: string }) => ({ color: tone }))
    const createRecipe = recipe(create)
    const props = { tone: "tomato" }
    const styles = createRecipe(props)

    expect(create).toHaveBeenCalledWith(props)
    expect(styles).toBeInstanceOf(Styles)
    expect(styles.toString()).toBe("color:tomato;")
  })

  it("appends styles returned as an array", () => {
    const createRecipe = recipe(() => [
      css`
        color: red;
        &:hover {
          color: blue;
        }
      `,
      { backgroundColor: "white", "&:hover": { opacity: 0.8 } },
    ])

    const styles = createRecipe({})

    expect(styles.styles).toStrictEqual({
      color: "red",
      "&:hover": { color: "blue", opacity: 0.8 },
      backgroundColor: "white",
    })
    expect(styles.toString()).toBe(
      "color:red;background-color:white;&:hover{color:blue;opacity:0.8;}",
    )
  })

  it("filters out falsey conditional styles", () => {
    const createRecipe = recipe(({ active }: { active: boolean }) => [
      new Styles({ color: "red" }),
      active && new Styles({ fontWeight: "bold" }),
      null,
      undefined,
      false,
    ])

    expect(createRecipe({ active: false }).toString()).toBe("color:red;")
    expect(createRecipe({ active: true }).toString()).toBe(
      "color:red;font-weight:bold;",
    )
  })
})
