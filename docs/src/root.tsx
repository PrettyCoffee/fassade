import { type PropsWithChildren } from "react"

import { Global, ExtractCss, css } from "#lib/fassade"

import { theme } from "./theme"

const themeStyles = css`
  :root {
    color-scheme: light dark;
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
`

const globalStyles = css`
  ${themeStyles}

  :root {
    font: 500 1rem ${theme("font.sans")};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100svh;
  }

  body {
    color: ${theme("text.default")};
    background: ${theme("bg.default")};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${theme("font.head")};
    margin: 0;
    line-height: 1;
    letter-spacing: 0.05em;
  }

  p {
    margin: 0;
    line-height: 1.5;
    text-align: justify;
    hyphens: auto;
    hyphenate-limit-chars: 10;
    text-wrap: pretty;
  }
`

const ApplyUserTheme = () => (
  <script>
    {`
    (() => {
      const theme = localStorage.getItem("fassade/theme-mode");
      if (theme) document.documentElement.classList.add(theme);
    })();
    `}
  </script>
)

export const Root = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="./fonts/fonts.css" />
      <title>Fassade</title>

      <Global styles={globalStyles} />
      <ExtractCss />
      <ApplyUserTheme />
    </head>

    <body>
      <div id="root">{children}</div>
    </body>
  </html>
)
