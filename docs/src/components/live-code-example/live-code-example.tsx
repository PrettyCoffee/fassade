"use client"

import { useRef, useState } from "react"

import { styled } from "#lib/fassade"

import { useCopy } from "../../hooks/use-copy"
import { remToPx } from "../../utils/rem-to-px"
import { HBorder } from "../border"
import { CodeEditor } from "./code-editor"
import { CodePreview } from "./code-preview"
import { CodeTabs } from "./code-tabs"
import { ResizableBorder } from "./resizable-border"

const DEFAULT_SPLIT = 50
const MIN_PANE_RATIO = 0.2

const OuterLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 25rem;
  isolation: isolate;
`

const InnerLayout = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`

const Code = styled.div`
  position: relative;
  flex: none;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 40rem) {
    width: 50%;
  }
`

const snapResizing = (ratio: number, width: number) => {
  const centerSnapRatio = Math.ceil(100 / (width / remToPx(1))) / 100
  const centerSnapMin = 0.5 - centerSnapRatio
  const centerSnapMax = 0.5 + centerSnapRatio
  return ratio > centerSnapMin && ratio < centerSnapMax
    ? 0.5
    : Math.min(Math.max(ratio, MIN_PANE_RATIO), 1 - MIN_PANE_RATIO)
}

interface LiveCodeExampleProps {
  initialHtml?: string
  initialJs: string
  className?: string
  onChange?: (html: string, js: string) => void
}

export const LiveCodeExample = ({
  initialHtml = "",
  initialJs,
  onChange,
  className,
}: LiveCodeExampleProps) => {
  const [html, setHtml] = useState(initialHtml)
  const [js, setJs] = useState(initialJs)

  const layoutRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(DEFAULT_SPLIT)
  const splitRef = useRef(DEFAULT_SPLIT)

  const updateSplit = (value: number) => {
    splitRef.current = value
    setSplit(value)
  }

  const handleResize = (
    delta: number,
    commit: (finalDelta: number) => void,
  ) => {
    const layout = layoutRef.current
    if (!layout) return commit(0)

    const { width } = layout.getBoundingClientRect()
    const codeWidth = (splitRef.current / 100) * width

    const ratio = (codeWidth + delta) / width
    const clampedRatio = snapResizing(ratio, width)

    commit(clampedRatio * width - codeWidth)
    updateSplit(clampedRatio * 100)
  }

  const { copied, copy } = useCopy()

  const setCode = (code: { html?: string; js?: string }) => {
    if (code.html != null) setHtml(code.html)
    if (code.js != null) setJs(code.js)
    onChange?.(code.html ?? html, code.js ?? js)
  }

  const jsEditor = <CodeEditor value={js} onChange={js => setCode({ js })} />

  const htmlEditor = (
    <CodeEditor value={html} onChange={html => setCode({ html })} />
  )

  return (
    <OuterLayout
      className={[className, "full-width"].filter(Boolean).join(" ")}
      style={{ isolation: "isolate" }}
    >
      <HBorder />
      <InnerLayout ref={layoutRef}>
        <Code style={{ width: `${split}%` }}>
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
                onClick: () => setCode({ html: initialHtml, js: initialJs }),
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

        <ResizableBorder
          onResize={handleResize}
          onReset={() => updateSplit(DEFAULT_SPLIT)}
        />

        <CodePreview html={html} js={js} />
      </InnerLayout>
      <HBorder />
    </OuterLayout>
  )
}
