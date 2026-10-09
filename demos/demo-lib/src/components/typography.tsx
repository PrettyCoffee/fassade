import { css, styled, type Theme } from "../fassade"

const heading = (t: Theme) => css`
  font-family: ${t("font.head")};
  font-weight: 500;
  color: ${t("text.default")};
`

export const H1 = styled.h1(
  (_props, t) => css`
    ${heading(t)}
    font-size: 56px;
    letter-spacing: -1.68px;
    margin: 32px 0;
    @media (max-width: 1024px) {
      font-size: 36px;
      margin: 20px 0;
    }
  `,
)

export const H2 = styled.h1(
  (_props, t) => css`
    ${heading(t)}
    font-size: 24px;
    line-height: 118%;
    letter-spacing: -0.24px;
    margin: 0 0 8px;
    @media (max-width: 1024px) {
      font-size: 20px;
    }
  `,
)

export const Code = styled.code(
  (_props, t) => css`
    font-family: ${t("font.mono")};
    display: inline-flex;
    border-radius: 4px;
    color: ${t("text.default")};
    font-size: 15px;
    line-height: 135%;
    padding: 4px 8px;
    background: ${t("bg.code")};
  `,
)
