import { useRef, useState } from "react"

import { css, styled } from "#lib/fassade"

import { VBorder } from "../border"

const Handle = styled.button(
  ({ t }) => css`
    position: relative;
    flex: none;
    padding: 0;
    border: none;
    background: none;
    cursor: col-resize;
    touch-action: none;

    @media (max-width: 40rem) {
      display: none;
    }

    &:hover > span,
    &[data-dragging] > span {
      background: ${t("stroke.default")};
    }

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -0.5rem;
      right: -0.5rem;
      z-index: 1;
    }
  `,
)

interface ResizableBorderProps {
  onReset: () => void
  onResize: (delta: number, commit: (finalDelta: number) => void) => void
}

export const ResizableBorder = ({
  onReset,
  onResize,
}: ResizableBorderProps) => {
  const [dragging, setDragging] = useState(false)
  const lastX = useRef(0)

  return (
    <Handle
      aria-label="Resize panes"
      data-dragging={dragging || undefined}
      onPointerDown={event => {
        event.currentTarget.setPointerCapture(event.pointerId)
        lastX.current = event.clientX
        setDragging(true)
      }}
      onPointerMove={event => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return

        const delta = event.clientX - lastX.current
        if (delta === 0) return

        onResize(delta, finalDelta => {
          lastX.current += finalDelta
        })
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onDoubleClick={() => {
        lastX.current = 0
        onReset()
      }}
    >
      <VBorder />
    </Handle>
  )
}
