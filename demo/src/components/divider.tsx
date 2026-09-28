import { styled } from "#lib/goobrrr"

const Border = styled.span`
  position: relative;
  display: block;
  background: var(--border);

  &::before,
  &::after {
    content: "";
    position: absolute;
    border: 5px solid transparent;
  }
`

const HBorder = styled(Border)`
  min-width: 100%;
  height: 1px;

  &::before {
    top: -4.25px;
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    top: -4.25px;
    right: 0;
    border-right-color: var(--border);
  }
`

const VBorder = styled(Border)`
  min-height: 100%;
  width: 1px;

  &::before {
    left: -4.25px;
    top: 0;
    border-top-color: var(--border);
  }
  &::after {
    left: -4.25px;
    bottom: 0;
    border-bottom-color: var(--border);
  }
`

interface DividerProps {
  orientation?: "horizontal" | "vertical"
}
export const Divider = ({ orientation = "horizontal" }: DividerProps) =>
  orientation === "vertical" ? <VBorder /> : <HBorder />
