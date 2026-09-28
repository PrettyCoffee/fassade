import { describe, it, expect } from "vitest"

import { toString } from "./to-string"
import { type StyleNode } from "./types"

interface TestCase {
  name: string
  input: StyleNode
  selector: string
  css: string
}

const cases: TestCase[] = [
  {
    name: "declarations",
    input: { color: "red", backgroundColor: "blue" },
    selector: ".abc123",
    css: ".abc123{color:red;background-color:blue;}",
  },
  {
    name: "nested selector",
    input: { "&:hover": { color: "red" } },
    selector: ".abc123",
    css: ".abc123{&:hover{color:red;}}",
  },
  {
    name: "multiple selectors",
    input: { "&:hover": { color: "red" } },
    selector: ".abc123,.def456",
    css: ".abc123,.def456{&:hover{color:red;}}",
  },
  {
    name: "css custom property",
    input: { "--accent-color": "red" },
    selector: ".abc123",
    css: ".abc123{--accent-color:red;}",
  },
  {
    name: "media query",
    input: { "@media (min-width: 768px)": { color: "red" } },
    selector: ".abc123",
    css: ".abc123{@media (min-width: 768px){color:red;}}",
  },
  {
    name: "keyframes",
    input: { "@keyframes fade": { from: { opacity: 0 }, to: { opacity: 1 } } },
    selector: "",
    css: "@keyframes fade{from{opacity:0;}to{opacity:1;}}",
  },
  {
    name: "font face",
    input: {
      "@font-face": { fontFamily: "Example", src: "url(example.woff2)" },
    },
    selector: "",
    css: "@font-face{font-family:Example;src:url(example.woff2);}",
  },
]

describe("Test parse", () => {
  it.each(cases)("parses $name", ({ input, selector, css }) => {
    expect(toString(input, selector)).toBe(css)
  })
})
