"use client"

import { useEffect, useRef, useState } from "react"
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"

import initSwc, { transform } from "@swc/wasm-web"

import { css, glob, keyframes, recipe, styled, variants } from "#lib/fassade"

const ErrorBackdrop = styled.div(
  ({ t }) => css`
    position: absolute;
    inset: 0;
    padding: 1rem;
    background: color-mix(in srgb, ${t("alert.error")} 5%, transparent);
    backdrop-filter: blur(2px);

    display: flex;
    align-items: end;
    justify-content: center;
  `,
)

const ErrorSurface = styled.div(
  ({ t }) => css`
    max-height: 100%;
    overflow: auto;
    background: color-mix(in srgb, ${t("bg.default")} 75%, transparent);
    padding: 1rem;
    border-radius: 0.5rem;
  `,
)

const ErrorTitle = styled.h3(
  ({ t }) => css`
    color: ${t("alert.error")};
    font-weight: bold;
    margin-bottom: 0.5rem;
  `,
)

const ErrorMessage = styled.pre(
  ({ t }) => css`
    color: ${t("text.default")};
    white-space: pre-wrap;
  `,
)

const ErrorOverlay = ({
  title,
  message,
}: {
  title: string
  message: string
}) => (
  <ErrorBackdrop role="alert">
    <ErrorSurface>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorSurface>
  </ErrorBackdrop>
)

let swcInitialization: Promise<unknown> | undefined
const initializeSwc = () => (swcInitialization ??= initSwc())

const Layout = styled.div`
  isolation: isolate;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Preview = styled.div`
  padding: 1rem;
  overflow: auto;
`

const evalWithGlobals = (code: string, globals: Record<string, unknown>) => {
  // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-implied-eval -- execute playground code
  new Function(...Object.keys(globals), code)(...Object.values(globals))
}

const transpile = (js: string) =>
  transform(js, {
    filename: "snippet.tsx",
    swcrc: false,
    jsc: {
      parser: { syntax: "typescript", tsx: true },
      transform: { react: { runtime: "classic" } },
    },
  }).then(({ code }) => code)

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

interface CodePreviewProps {
  html: string
  js: string
  className?: string
}
export const CodePreview = ({ html, js }: CodePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const roots = useRef(new Map<Element, Root>())
  const [error, setError] = useState<string>()

  useEffect(() => {
    let canceled = false
    const currentRoots = roots.current

    const render = (element: React.ReactNode, target = previewRef.current) => {
      if (!target || !previewRef.current?.contains(target))
        throw new Error("React render targets must be inside the preview HTML")

      let reactRoot = currentRoots.get(target)
      if (!reactRoot) {
        reactRoot = createRoot(target)
        currentRoots.set(target, reactRoot)
      }
      reactRoot.render(element)
    }

    const run = async () => {
      const preview = previewRef.current
      if (!preview) return

      preview.innerHTML = html
      setError(undefined)

      try {
        await initializeSwc()
        if (canceled) return

        const code = await transpile(js)
        // oxlint-disable-next-line typescript/no-unnecessary-condition -- status might change during async actions
        if (canceled) return

        evalWithGlobals(code, {
          // from modules
          React,
          css,
          glob,
          keyframes,
          recipe,
          variants,
          styled,

          // locals
          root: preview,
          render,
        })
      } catch (error) {
        if (canceled) return
        setError(getErrorMessage(error))
      }
    }

    const timer = setTimeout(() => void run(), 500)

    return () => {
      canceled = true
      clearTimeout(timer)
      for (const reactRoot of currentRoots.values()) reactRoot.unmount()
      currentRoots.clear()
    }
  }, [html, js])

  return (
    <Layout>
      <Preview ref={previewRef} />
      {error && <ErrorOverlay title="An Error Occured!" message={error} />}
    </Layout>
  )
}
