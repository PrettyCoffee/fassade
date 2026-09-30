import { type PropsWithChildren } from "react"

import { createPages } from "waku"
import adapter from "waku/adapters/default"

import { App } from "./app/app"
import { GlobalStyles } from "./global-styles"

const Root = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>waku demo</title>
      <GlobalStyles />
    </head>

    <body>
      <div id="root">{children}</div>
    </body>
  </html>
)

// oxlint-disable-next-line typescript/require-await -- must be async
const pages = createPages(async ({ createRoot, createPage }) => [
  createRoot({
    render: "static",
    component: Root,
  }),

  createPage({
    render: "static",
    path: "/",
    component: App,
  }),
])

export default adapter(pages, { static: true })
