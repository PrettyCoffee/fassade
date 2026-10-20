import { styled } from "fassade/jsx"

const Button = styled.button`
  color: rebeccapurple;
  background: antiquewhite;
`

export const App = () => (
  <Button onClick={() => console.info("Button was clicked")}>
    I am a button
  </Button>
)
