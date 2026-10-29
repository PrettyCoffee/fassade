"use client"

import { css, styled } from "#lib/fassade"

import { type useNavigation } from "./use-navigation"

const Rail = styled.svg(
  ({ t }) => css`
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 1px;
    height: 100%;
    overflow: visible;
    pointer-events: none;

    polyline,
    line {
      fill: none;
      stroke: ${t("stroke.gentle")};
      stroke-width: 1px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    polyline[data-active],
    line[data-active] {
      stroke: ${t("text.default")};
      @media (prefers-reduced-motion: no-preference) {
        transition:
          stroke-dasharray 500ms ease-out,
          stroke-dashoffset 500ms ease-out;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      polyline[data-active],
      line[data-active] {
        transition: none;
      }
    }
  `,
)

export const NavListRail = ({
  elements,
  visible,
}: ReturnType<typeof useNavigation>) => {
  const rail = {
    height: elements.length * 32,
    width: 1,
    offset: 4,
    activeLength: (visible.end - visible.start + 1) * 32,
    activeOffset: -visible.start * 32,
  }

  return (
    <Rail
      aria-hidden="true"
      viewBox={`0 0 1 ${rail.height}`}
      preserveAspectRatio="none"
    >
      <line x1={0} x2={0} y1={rail.offset} y2={rail.height - rail.offset} />
      <line
        data-active=""
        x1={0}
        x2={0}
        y1={rail.offset}
        y2={rail.height - rail.offset}
        strokeDasharray={`${rail.activeLength - rail.offset * 2} ${rail.height}`}
        strokeDashoffset={rail.activeOffset}
      />
    </Rail>
  )
}
