import { css } from "../fassade"
import { theme } from "../theme"

export const globalStyles = css`
  :root {
    ${theme.getVarsCss("light")}
    @media (prefers-color-scheme: dark) {
      ${theme.getVarsCss("dark")}
    }
  }
  .light {
    ${theme.getVarsCss("light")}
  }
  .dark {
    ${theme.getVarsCss("dark")}
  }

  :root {
    font: 18px/145% ${theme("font.sans")};
    letter-spacing: 0.18px;
    color-scheme: light dark;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    @media (max-width: 1024px) {
      font-size: 16px;
    }
  }

  * {
    box-sizing: border-box;
  }

  #root {
    width: 1126px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid ${theme("stroke")};
    min-height: 100svh;
    display: flex;
    flex-direction: column;
  }

  body {
    margin: 0;
    color: ${theme("text.gentle")};
    background: ${theme("bg.default")};
  }

  p {
    margin: 0;
  }
`
