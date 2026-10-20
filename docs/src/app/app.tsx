import { CodeExample, LiveCodeExample, Section, Space } from "#components"

import { cleanCode } from "../utils/clean-code"
import example from "./example?raw"

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
    <Section index={1} title="Getting Started">
      <p>Docs are WIP</p>
    </Section>

    <Section index={2} title="Code Example">
      <CodeExample name="sample.ts" code={cleanCode(example)} />
    </Section>

    <Section index={3} title="Live Editor">
      <p>Try out the live editor below.</p>

      <h3>Vanilla</h3>
      <LiveCodeExample initialHtml={previewHtml} initialJs={previewJs} />
      <Space bottom="2rem" />
      <h3>React</h3>
      <LiveCodeExample initialJs={reactPreviewJs} />
    </Section>

    <Space bottom="100rem" />
  </>
)
