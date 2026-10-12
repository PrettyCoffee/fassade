import { Code, LiveCodeExample, Space } from "#components"

import { cleanCode } from "../utils/clean-code"
import example from "./code-example?raw"

const previewHtml = '<p id="example">Hello from CodePreview</p>'
const previewJs = cleanCode(`
const styles = css\`
  padding: 1rem;
  border-radius: 1rem;
  color: rebeccapurple;
  background: antiquewhite;
\`

const className = styles.inject()
root.querySelector("#example")?.classList.add(className)
`)

const reactPreviewJs = cleanCode(`
const Btn = styled.button({
  color: "rebeccapurple",
  background: "antiquewhite",
})

const Counter = () => {
  const [count, setCount] = React.useState(0)
  return (
    <Btn onClick={() => setCount(value => value + 1)}>
      Clicked {count} times
    </Btn>
  )
}

render(<Counter />)
`)

export const App = () => (
  <>
    <h2>Getting Started</h2>
    <p>Docs are WIP</p>
    <Space bottom="2rem" />

    <h2>Code Example</h2>
    <Code code={cleanCode(example)} />
    <Space bottom="2rem" />

    <h2>Live Editor</h2>
    <h3>Vanilla</h3>
    <LiveCodeExample
      initialHtml={previewHtml}
      initialJs={previewJs}
      className="full-width"
    />
    <Space bottom="2rem" />
    <h3>React</h3>
    <LiveCodeExample initialJs={reactPreviewJs} className="full-width" />
    <Space bottom="100rem" />
  </>
)
