import { styled } from "#lib/fassade"

interface SpaceProps {
  top?: string
  bottom?: string
  left?: string
  right?: string

  x?: string
  y?: string

  all?: string
}

export const Space = styled.div<SpaceProps>(
  ({ all, x, y, top, bottom, left, right }) => ({
    paddingTop: top ?? y ?? all,
    paddingBottom: bottom ?? y ?? all,
    paddingLeft: left ?? x ?? all,
    paddingRight: right ?? x ?? all,
  }),
)
