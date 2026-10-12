"use client"

import { css, styled } from "#lib/fassade"

import { Code } from "../code"

const sharedStyles = css`
  border: none;
  outline: 0;
  background: none;
  display: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-variant-ligatures: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  tab-size: inherit;
  text-indent: inherit;
  text-rendering: inherit;
  text-transform: inherit;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;

  min-height: max-content;
  height: 100%;
  padding: 0.75rem 1rem;
  margin: 0;

  * {
    white-space: inherit;
    font-family: inherit;
    font-size: inherit;
  }
`

const Layout = styled.div(
  ({ t }) => css`
    position: relative;
    overflow: hidden;
    font-family: ${t("font.mono")};
    line-height: 1.5;
  `,
)

const Preview = styled(Code)`
  ${sharedStyles}
`

const TextArea = styled.textarea(
  ({ t }) => css`
    ${sharedStyles}

    position: absolute;
    inset: 0;
    z-index: 1;
    resize: none;
    overflow: hidden;

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-text-fill-color: transparent;

    &::placeholder {
      -webkit-text-fill-color: initial;
      color: ${t("text.muted")};
    }
  `,
)

interface CodeEditorProps {
  placeholder?: string
  value: string
  onChange?: (value: string) => void
}
export const CodeEditor = ({
  placeholder,
  value,
  onChange,
}: CodeEditorProps) => (
  <Layout>
    <Preview code={value} preserveTrailingWhitespace />
    <TextArea
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"

      placeholder={placeholder}
      value={value}
      onChange={({ target }) => onChange?.(target.value)}
    />
  </Layout>
)
