"use client"

import { useState } from "react"

import { styled } from "#lib/fassade"

import { useCopy } from "../../hooks/use-copy"
import { HBorder, VBorder } from "../border"
import { CodeEditor } from "./code-editor"
import { CodePreview } from "./code-preview"
import { CodeTabs } from "./code-tabs"

const Layout = styled.div`
  display: flex;
  > *:first-child,
  > *:last-child {
    flex: 1;
  }
`

const Code = styled.div`
  position: relative;
  height: 25rem;
  overflow-x: hidden;
  overflow-y: scroll;
`

interface LiveCodeExampleProps {
  initialHtml?: string
  initialJs: string
  className?: string
}

export const LiveCodeExample = ({
  initialHtml = "",
  initialJs,
  className,
}: LiveCodeExampleProps) => {
  const [html, setHtml] = useState(initialHtml)
  const [js, setJs] = useState(initialJs)

  const { copied, copy } = useCopy()

  const jsEditor = <CodeEditor value={js} onChange={setJs} />
  const htmlEditor = <CodeEditor value={html} onChange={setHtml} />

  const reset = () => {
    setHtml(initialHtml)
    setJs(initialJs)
  }

  return (
    <div className={className} style={{ isolation: "isolate" }}>
      <HBorder />
      <Layout>
        <Code>
          <CodeTabs
            tabs={
              !initialHtml && /render\(.+\)/.test(initialJs)
                ? { JSX: jsEditor }
                : { JavaScript: jsEditor, HTML: htmlEditor }
            }
            actions={[
              {
                icon: "erase",
                title: "Revert changes",
                onClick: reset,
              },
              {
                icon: copied ? "copy-check" : "copy",
                title: "Copy code",
                onClick: active => void copy(active === "HTML" ? html : js),
                color: copied ? "alert.success" : undefined,
              },
            ]}
          />
        </Code>

        <VBorder />

        <CodePreview html={html} js={js} />
      </Layout>
      <HBorder />
    </div>
  )
}
