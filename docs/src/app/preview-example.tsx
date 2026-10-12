"use client"
import { useState } from "react"

import { CodeEditor, CodePreview, HBorder, VBorder } from "#components"
import { styled } from "#lib/fassade"

const Layout = styled.div`
  display: flex;
  > *:first-child,
  > *:last-child {
    flex: 1;
    overflow: hidden;
  }
`

export const PreviewExample = ({
  initialHtml,
  initialJs,
}: {
  initialHtml: string
  initialJs: string
}) => {
  const [html, setHtml] = useState(initialHtml)
  const [js, setJs] = useState(initialJs)
  return (
    <>
      <HBorder />
      <Layout>
        <div>
          <CodeEditor
            value={html}
            onChange={setHtml}
            placeholder="Type some HTML here..."
          />
          <CodeEditor
            value={js}
            onChange={setJs}
            initialValue="Type some JavaScript here..."
          />
        </div>

        <VBorder />

        <CodePreview html={html} js={js} />
      </Layout>
      <HBorder />
    </>
  )
}
