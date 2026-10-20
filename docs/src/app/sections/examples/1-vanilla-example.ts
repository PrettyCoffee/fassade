// oxlint-disable no-restricted-globals
import { css } from "fassade"

// define styles with an object
const layout = css({
  padding: "1rem",
  borderRadius: "1rem",
})

// define styles with a template string
const colors = css`
  color: rebeccapurple;
  background: antiquewhite;
`

// inject() the defined styles into the document to receive the class names
const classList = [layout.inject(), colors.inject()]

// add the css classes to an element
document.getElementById("example")?.classList.add(...classList)
