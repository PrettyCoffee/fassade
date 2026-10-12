import { Code, CodeEditor, Space } from "#components"

import { cleanCode } from "../utils/clean-code"
import example from "./code-example?raw"

export const App = () => (
  <>
    <h2>Getting Started</h2>
    <p>Docs are WIP</p>
    <Space bottom="2rem" />

    <h2>Code Example</h2>
    <Code code={cleanCode(example)} />
    <Space bottom="2rem" />

    <h2>Code Editor</h2>
    <CodeEditor initialValue={cleanCode(example)} />
    <Space bottom="100rem" />
  </>
)
