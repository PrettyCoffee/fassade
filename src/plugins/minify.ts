import { type Plugin } from "./plugin"

/** Plugin to build a minified version of the styles. */
export const minify = (): Plugin => ({
  name: "minify",
  buildRule: ({ key, value }) => `${key}:${value.replaceAll(/\s+/gm, " ")};`,
  buildBlock: ({ selector, content }) => `${selector}{${content}}`,
})
