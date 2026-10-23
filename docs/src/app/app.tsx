import { readdir } from "node:fs/promises"

import { type FC } from "react"

import { LiveCodeExample, Section, Space } from "#components"

import { cleanCode } from "../utils/clean-code"
import { LayoutWithNav } from "./layouts/layout-with-nav"

const getSectionList = () => readdir("./src/app/sections")
const getSectionComponent = (fileName: string) =>
  import(`./sections/${fileName}.tsx`).then(
    module => (module as { default: FC }).default,
  )

const parseSectionName = (path: string) => {
  const file = path.split("/").pop() ?? ""
  const [, fileName, index, name] = /^(([0-9]+)-(.+))\.[a-z]+$/.exec(file) ?? []

  if (!fileName || !index || !name) return null

  return {
    path,
    fileName,
    index: Number(index),
    title: name.replaceAll("-", " "),
  }
}

const getSections = async () => {
  const sections = await getSectionList().then(list =>
    list.flatMap(path => parseSectionName(path) ?? []),
  )
  return Promise.all(
    sections.map(async section => ({
      ...section,
      Component: await getSectionComponent(section.fileName),
    })),
  )
}

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
const Button = styled.button({
  color: "rebeccapurple",
  background: "antiquewhite",
})

const Counter = () => {
  const [count, setCount] = React.useState(0)
  return (
    <Button onClick={() => setCount(value => value + 1)}>
      Clicked {count} times
    </Button>
  )
}

render(<Counter />)
`)

export const App = async () => {
  const sections = await getSections()
  return (
    <LayoutWithNav>
      {sections.map(({ index, title, Component }) => (
        <Section key={index} index={index} title={title}>
          <Component />
        </Section>
      ))}

      <Section index={2} title="Live Editor">
        <p>Try out the live editor below.</p>

        <h3>Vanilla</h3>
        <LiveCodeExample
          initialHtml={previewHtml}
          initialJs={previewJs}
          className="full-width"
        />
        <Space bottom="2rem" />
        <h3>React</h3>
        <LiveCodeExample initialJs={reactPreviewJs} className="full-width" />
      </Section>

      <Space bottom="100rem" />
    </LayoutWithNav>
  )
}
