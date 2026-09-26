import { type Plugin } from "./plugin"

const prettier = (css: string, indentSpaces = 2) => {
  const lines = css
    .replaceAll(/\s+/gm, " ")
    .replaceAll(/;\s*/gm, ";\n")
    .replaceAll(/\s*({)\s*/gm, " {\n")
    .replaceAll(/}}/gm, "}\n}")
    .replaceAll(/}\s*/gm, "}\n")
    .split("\n")

  const withIndent = lines.reduce(
    (result, line) => {
      if (line.includes("}")) result.depth -= 1
      const indent = " ".repeat(result.depth * indentSpaces)
      if (line.includes("{")) result.depth += 1

      result.lines.push(`${indent}${line}`)
      return result
    },
    { lines: [] as string[], depth: 0 },
  )

  return withIndent.lines.join("\n").replaceAll(/\s*^(.*)\{/gm, "\n$1{")
}

/**
 * Plugin to build a pretty version (with indentation and line breaks) of the
 * styles.
 */
export const pretty = (): Plugin => ({
  name: "pretty",
  buildRule: ({ key, value }) => `${key}: ${value};`,
  buildBlock: ({ selector, content }) => `${selector} {${content}}`,
  end: ({ result }) => prettier(result),
})
