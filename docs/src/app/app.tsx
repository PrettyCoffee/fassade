import { Code, Space } from "#components"

import example from "./code-example?raw"

export const App = () => (
  <>
    <h2>Getting Started</h2>
    <p>Docs are WIP</p>
    <Code code={example} />
    <Space bottom="100rem" />
  </>
)
