import { use } from "react"

import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import tsx from "shiki/langs/tsx.mjs"
import dark from "shiki/themes/dark-plus.mjs"
import light from "shiki/themes/light-plus.mjs"

import { styled } from "#lib/fassade"

const highlighterPromise = createHighlighterCore({
  engine: createJavaScriptRegexEngine(),
  langs: [tsx],
  themes: [
    { ...dark, name: "dark", bg: "transparent" },
    { ...light, name: "light", bg: "transparent" },
  ],
})

const clean = (code: string) =>
  code
    // remove oxlint comments
    .replaceAll(/^.*oxlint-disable.*$/gm, "")
    .trim()

const Layout = styled.div`
  pre {
    margin: 0;
  }
`

interface CodeProps {
  code: string
  className?: string
}

export const Code = ({ code, ...rest }: CodeProps) => {
  const highlighter = use(highlighterPromise)
  const html = highlighter.codeToHtml(clean(code), {
    lang: "tsx",
    theme: "dark",
  })
  return (
    <Layout
      {...rest}
      // oxlint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
