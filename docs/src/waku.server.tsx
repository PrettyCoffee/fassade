import { createPages } from "waku"
import adapter from "waku/adapters/default"

import { App } from "./app/app"
import { Playground } from "./app/playground"
import { Layout } from "./layout"
import { Root } from "./root"

// oxlint-disable-next-line typescript/require-await -- must be async
const pages = createPages(async ({ createRoot, createLayout, createPage }) => [
  createRoot({
    render: "static",
    component: Root,
  }),

  createLayout({
    render: "static",
    path: "/",
    component: Layout,
  }),

  createPage({
    render: "static",
    path: "/",
    component: App,
  }),

  createPage({
    render: "static",
    path: "/playground",
    component: Playground,
  }),
])

export default adapter(pages, { static: true })
