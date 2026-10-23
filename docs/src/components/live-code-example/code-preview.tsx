"use client"

import { useEffect, useRef, useState } from "react"
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"

import initSwc, { transform } from "@swc/wasm-web"

import { css, glob, keyframes, recipe, styled, variants } from "#lib/fassade"

const Backdrop = styled.div<{ kind: "error" | "pending" }>(({ t, kind }) => [
  css`
    position: absolute;
    inset: 0;
    padding: 1rem;
    backdrop-filter: blur(2px);

    display: flex;
    justify-content: center;
  `,
  kind === "error"
    ? css`
        background: color-mix(in srgb, ${t("alert.error")} 5%, transparent);
        align-items: end;
      `
    : css`
        background: ${t("bg.default")};
        align-items: center;
      `,
])

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
  <Backdrop role="alert" kind="error">
    <ErrorSurface>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorSurface>
  </Backdrop>
)

const boxAnimation = keyframes`
  100% { translate: -1.75rem -1.75rem; }
  0% { translate: -1.75rem -1.75rem; }
  8.33% { translate: -1.75rem -1.75rem; }
  16.66% { translate: -1.75rem -1.75rem; }

  25% { translate: 1.75rem -1.75rem; }
  33.33% { translate: 1.75rem -1.75rem; }
  41.66% { translate: 1.75rem -1.75rem; }

  50% { translate: 1.75rem 1.75rem; }
  58.33% { translate: 1.75rem 1.75rem; }
  66.66% { translate: 1.75rem 1.75rem; }

  75% { translate: -1.75rem 1.75rem; }
  83.33% { translate: -1.75rem 1.75rem; }
  91.66% { translate: -1.75rem 1.75rem; }
`
const PendingBox = styled.div(
  ({ t }) => css`
    position: absolute;
    background: ${t("bg.alt")};
    height: 3rem;
    width: 3rem;
    border-radius: 0.5rem;

    animation: ${boxAnimation} 3s infinite ease-out;
    animation-play-state: paused;
    &:nth-of-type(1) {
      animation-delay: -0.5s;
    }
    &:nth-of-type(2) {
      animation-delay: -1.5s;
    }
    &:nth-of-type(3) {
      animation-delay: -2.5s;
    }

    @media (prefers-reduced-motion: no-preference) {
      animation-play-state: running;
    }
  `,
)

const PendingText = styled.div(
  ({ t }) => css`
    color: ${t("text.muted")};
    translate: 0 5rem;
  `,
)

const PendingOverlay = () => (
  <Backdrop kind="pending">
    <PendingBox />
    <PendingBox />
    <PendingBox />
    <PendingText>Rendering...</PendingText>
  </Backdrop>
)

let swcInitialization: Promise<unknown> | undefined
const initializeSwc = () => (swcInitialization ??= initSwc())

const Layout = styled.div`
  isolation: isolate;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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
  const [pending, setPending] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let canceled = false
    const currentRoots = roots.current
    // oxlint-disable-next-line react/set-state-in-effect -- mark as pending while code is rendering
    setPending(true)

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
        if (!canceled) setError(getErrorMessage(error))
      } finally {
        if (!canceled) setPending(false)
      }
    }

    const timer = setTimeout(() => void run(), 1000)

    return () => {
      canceled = true
      clearTimeout(timer)
      // defer, since cleanup can run during another root's commit phase
      for (const reactRoot of currentRoots.values())
        queueMicrotask(() => reactRoot.unmount())
      currentRoots.clear()
    }
  }, [html, js])

  return (
    <Layout>
      <Preview ref={previewRef} />
      {error && <ErrorOverlay title="An Error Occured!" message={error} />}
      {pending && <PendingOverlay />}
    </Layout>
  )
}
