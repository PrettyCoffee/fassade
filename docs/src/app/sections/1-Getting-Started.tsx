// oxlint-disable @pretty-cozy/file-name-case
import { CodeExample } from "#components"

import reactExample from "./examples/1-react-example?raw"
import example from "./examples/1-vanilla-example?raw"

const GettingStarted = () => (
  <>
    <p>Start by installing the package:</p>
    <CodeExample name="npm" code="npm i fassade" />
    <p>
      With the package in place, you can start styling your application by
      utilizing the <code>css</code> helper. It can either be used as template
      function or by passing a style object.
    </p>
    <CodeExample name="Vanilla Example" code={example} />
    <p>
      If you are using React or Preact, you can also use the <code>styled</code>{" "}
      helper in addition, to create styled components:
    </p>
    <CodeExample name="React Example" code={reactExample} />
    <p>
      See the API documentation below to learn more about these and other
      available functions.
    </p>
  </>
)

export default GettingStarted
