import { css, styled } from "../goobrrr"

const Border = styled.span(
  (_props, t) => css`
    position: relative;
    display: block;
    background: ${t("stroke")};

    &::before,
    &::after {
      content: "";
      position: absolute;
      border: 5px solid transparent;
    }
  `,
)

const HBorder = styled(Border)(
  (_props, t) => css`
    min-width: 100%;
    height: 1px;

    &::before {
      top: -4.25px;
      left: 0;
      border-left-color: ${t("stroke")};
    }
    &::after {
      top: -4.25px;
      right: 0;
      border-right-color: ${t("stroke")};
    }
  `,
)

const VBorder = styled(Border)(
  (_props, t) => css`
    min-height: 100%;
    width: 1px;

    &::before {
      left: -4.25px;
      top: 0;
      border-top-color: ${t("stroke")};
    }
    &::after {
      left: -4.25px;
      bottom: 0;
      border-bottom-color: ${t("stroke")};
    }
  `,
)

interface DividerProps {
  orientation?: "horizontal" | "vertical"
}
export const Divider = ({ orientation = "horizontal" }: DividerProps) =>
  orientation === "vertical" ? <VBorder /> : <HBorder />
