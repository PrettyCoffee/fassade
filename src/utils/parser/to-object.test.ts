import { describe, it, expect } from "vitest"

import { toObject } from "./to-object"

interface TestCase {
  name: string
  css: string
  ast: object
}

const cases: TestCase[] = [
  { name: "empty input", css: "", ast: {} },
  { name: "single declaration", css: "color: red;", ast: { color: "red" } },
  {
    name: "multiple declarations",
    css: "color:red;background:blue;",
    ast: { color: "red", background: "blue" },
  },
  {
    name: "comments and extra whitespace",
    css: "/* comment */ color: red;  background: blue;",
    ast: { color: "red", background: "blue" },
  },
  {
    name: "multiline value",
    css: "background: linear-gradient(\n      red,\n      blue\n    );",
    ast: { background: "linear-gradient( red, blue )" },
  },
  {
    name: "custom property",
    css: "--accent-color: #f00;",
    ast: { "--accent-color": "#f00" },
  },
  {
    name: "class selector",
    css: ".red-text { color: red; }",
    ast: { ".red-text": { color: "red" } },
  },
  {
    name: "pseudo selector",
    css: "button:hover { color: red; }",
    ast: { "button:hover": { color: "red" } },
  },
  {
    name: "nested selector",
    css: "button.key { &:hover { color: red; } }",
    ast: { "button.key": { "&:hover": { color: "red" } } },
  },
  {
    name: "multiple nested selectors",
    css: ".button { color: red; &:hover { color: blue; } &:focus { outline: 0; } }",
    ast: {
      ".button": {
        color: "red",
        "&:hover": { color: "blue" },
        "&:focus": { outline: "0" },
      },
    },
  },
  {
    name: "media query",
    css: "@media (max-width: 1024px) { button { color: red; } }",
    ast: {
      "@media (max-width: 1024px)": {
        button: {
          color: "red",
        },
      },
    },
  },
  {
    name: "import rule",
    css: "@import url(example.css);",
    ast: { "@import": "url(example.css)" },
  },
  {
    name: "font face rule",
    css: "@font-face { font-family: Example; } @font-face { font-family: Example2; }",
    ast: {
      "@font-face": { "font-family": "Example" },
      "@font-face\u00000": { "font-family": "Example2" },
    },
  },
  {
    name: "repeated properties",
    css: "color:red;color:blue;",
    ast: { color: "red", "color\u00000": "blue" },
  },
]

describe("Test toObject", () => {
  it.each(cases)("parses $name", ({ css, ast }) => {
    expect(toObject(css)).toStrictEqual(ast)
  })

  // TODO: Improve css parsing to catch errors
  // oxlint-disable-next-line vitest/no-disabled-tests
  it.skip("raises error for rules with bad syntax", () => {
    const css = `
      color;red;
      background blue;
      .button [
        color: blue;
      ]
    `
    expect(toObject(css)).toStrictEqual({})
  })
})
