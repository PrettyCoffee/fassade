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

// shiki trims whitespace, but it is needed for the editor
const getWithTrailingWhitespace = (code: string, html: string) => {
  const ending = /(\s+)$/.exec(code)?.[1] ?? ""
  return html.replace(/<\/code><\/pre>$/, `${ending}</code></pre>`)
}

const Layout = styled.div`
  pre {
    margin: 0;
  }
`
Layout.styles({}).inject()

interface CodeProps {
  code: string
  className?: string
  preserveTrailingWhitespace?: boolean
}

export const Code = ({
  code,
  preserveTrailingWhitespace,
  ...rest
}: CodeProps) => {
  const highlighter = use(highlighterPromise)
  const html = highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "dark",
  })

  return (
    <Layout
      {...rest}
      // oxlint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: preserveTrailingWhitespace
          ? getWithTrailingWhitespace(code, html)
          : html,
      }}
    />
  )
}
