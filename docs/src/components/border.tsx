import { css, styled } from "#lib/fassade"

const Border = styled.span(
  ({ t }) => css`
    position: relative;
    z-index: 10;
    display: block;
    background: ${t("stroke.gentle")};

    &::before,
    &::after {
      content: "";
      position: absolute;
      border: 5px solid transparent;
    }
  `,
)

export const HBorder = styled(Border)(
  ({ t }) => css`
    min-width: 100%;
    height: 1px;

    &::before {
      top: -4.25px;
      left: 0;
      border-left-color: ${t("stroke.gentle")};
    }
    &::after {
      top: -4.25px;
      right: 0;
      border-right-color: ${t("stroke.gentle")};
    }
  `,
)

export const VBorder = styled(Border)(
  ({ t }) => css`
    min-height: 100%;
    width: 1px;

    &::before {
      left: -4.25px;
      top: 0;
      border-top-color: ${t("stroke.gentle")};
    }
    &::after {
      left: -4.25px;
      bottom: 0;
      border-bottom-color: ${t("stroke.gentle")};
    }
  `,
)
