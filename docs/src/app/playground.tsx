"use client"

import { useEffect, useState } from "react"

import { LiveCodeExample } from "#components"
import { css, styled } from "#lib/fassade"

import { cleanCode } from "../utils/clean-code"
import { getWindow } from "../utils/get-window"

const previewHtml = '<p id="example"></p>'
const previewJs = cleanCode(`
const styles = css\`
  padding: 1rem;
  border-radius: 1rem;
  color: rebeccapurple;
  background: antiquewhite;

  &::before {
    content: "Hello from the Playground";
  }
\`

const className = styles.inject()
root.querySelector("#example")?.classList.add(className)
`)

const reactPreviewJs = cleanCode(`
const Button = styled.button({
  color: "rebeccapurple",
  background: "antiquewhite",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  border: "none",
  cursor: "pointer",
  
  "&:hover": {
    opacity: 0.75
  },
  "&:focus-visible": {
    outline: "4px solid currentColor"
  }
})

const Counter = () => {
  const [count, setCount] = React.useState(0)
  return (
    <Button onClick={() => setCount(value => value + 1)}>
      Clicked {count} times
    </Button>
  )
}

render(<Counter />)
`)

const ToggleRow = styled.div`
  display: flex;
  padding: 1rem;

  > :first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  > :last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
`

const ToggleButton = styled.button(
  ({ t }) => css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 1rem;
    background: transparent;
    cursor: pointer;

    color: ${t("text.gentle")};
    border: 1px solid ${t("stroke.gentle")};
    &[aria-pressed="true"] {
      color: ${t("text.default")};
      border-color: ${t("stroke.default")};
    }
    &:hover,
    &:focus-visible {
      border-color: ${t("stroke.default")};
      background: ${t("bg.alt")};
    }
  `,
)

const modes = {
  js: { label: "Vanilla", initialCode: { html: previewHtml, js: previewJs } },
  jsx: { label: "React", initialCode: { html: "", js: reactPreviewJs } },
}
type Mode = keyof typeof modes

const parseMode = (value: string | null): Mode =>
  value === "jsx" ? "jsx" : "js"

const setUrlParam = (key: string, value: string | null) => {
  const window = getWindow()
  if (!window) return
  const url = new URL(window.location.href)
  if (value == null) url.searchParams.delete(key)
  else url.searchParams.set(key, value)
  window.history.replaceState(window.history.state, "", url)
}

const getUrlParam = (key: string) => {
  const window = getWindow()
  if (!window) return
  return new URLSearchParams(window.location.search).get(key)
}

const getSessionId = () => getUrlParam("id") || null

const setSessionId = () => {
  const id = getWindow()?.crypto.randomUUID() ?? ""
  setUrlParam("id", id)
  return id
}

const getSessionCode = () => {
  const id = getSessionId()
  const { sessionStorage } = getWindow() ?? {}
  if (!sessionStorage || !id) return null
  const html = sessionStorage.getItem(`fassade/${id}/html`) ?? ""
  const js = sessionStorage.getItem(`fassade/${id}/js`) ?? ""
  return !html && !js ? null : { html, js }
}

const setSessionCode = (html: string, js: string) => {
  const id = getSessionId() ?? setSessionId()
  const { sessionStorage } = getWindow() ?? {}
  if (!sessionStorage) return
  sessionStorage.setItem(`fassade/${id}/html`, html)
  sessionStorage.setItem(`fassade/${id}/js`, js)
}

const flexGrow = css`
  min-height: 0;
  flex: 1;
`.inject()

const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
`

const Editor = ({ mode }: { mode: Mode }) => {
  const initialCode = getSessionCode() ?? modes[mode].initialCode
  return (
    <LiveCodeExample
      className={flexGrow}
      initialHtml={initialCode.html}
      initialJs={initialCode.js}
      onChange={setSessionCode}
    />
  )
}

export const Playground = () => {
  const [mode, setMode] = useState<Mode>("js")

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- sync mode from URL after hydration
    setMode(parseMode(getUrlParam("editor") ?? null))
  }, [])

  const changeMode = (next: Mode) => {
    setUrlParam("editor", next)
    setUrlParam("id", null)
    setMode(next)
  }

  return (
    <Main>
      <ToggleRow>
        {(Object.keys(modes) as Mode[]).map(name => (
          <ToggleButton
            key={name}
            aria-pressed={mode === name}
            onClick={() => changeMode(name)}
          >
            {modes[name].label}
          </ToggleButton>
        ))}
      </ToggleRow>
      <Editor key={mode} mode={mode} />
    </Main>
  )
}
