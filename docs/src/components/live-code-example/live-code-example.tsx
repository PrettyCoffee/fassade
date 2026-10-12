"use client"

import { useState } from "react"

import { styled } from "#lib/fassade"

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

const CodeHeight = styled.div`
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

  const jsEditor = <CodeEditor value={js} onChange={setJs} />
  const htmlEditor = <CodeEditor value={html} onChange={setHtml} />

  return (
    <div className={className}>
      <HBorder />
      <Layout>
        <CodeHeight>
          {!initialHtml ? (
            jsEditor
          ) : (
            <CodeTabs tabs={{ JavaScript: jsEditor, HTML: htmlEditor }} />
          )}
        </CodeHeight>

        <VBorder />

        <CodePreview html={html} js={js} />
      </Layout>
      <HBorder />
    </div>
  )
}
