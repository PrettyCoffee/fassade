// oxlint-disable no-restricted-globals
import { css } from "fassade"

// define styles
const styles = css`
  padding: 1rem;
  border-radius: 1rem;
  color: rebeccapurple;
  background: antiquewhite;

  &::before {
    content: "Hello World";
  }
`

// inject the defined styles into the document and receive the class name
const className = styles.inject()

// add the css class to an element
document.getElementById("example")?.classList.add(className)
