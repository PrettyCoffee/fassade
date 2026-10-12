import { Code, Space } from "#components"

import { cleanCode } from "../utils/clean-code"
import example from "./code-example?raw"
import { PreviewExample } from "./preview-example"

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

const reactPreviewHtml = ""
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

    <h2>Code Previews</h2>
    <PreviewExample initialHtml={previewHtml} initialJs={previewJs} />
    <Space bottom="2rem" />

    <h2>React Example</h2>
    <PreviewExample initialHtml={reactPreviewHtml} initialJs={reactPreviewJs} />
    <Space bottom="100rem" />
  </>
)
