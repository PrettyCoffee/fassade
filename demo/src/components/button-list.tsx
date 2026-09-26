import { Children, PropsWithChildren } from "react"

import { styled } from "goobrrr"

const List = styled.ul`
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
      > * {
        width: 100%;
      }
    }
  }
`

const ListItem = styled.li`
  list-style: none;
  @media (max-width: 1024px) {
    flex: 1 1 calc(50% - 8px);
    > * {
      width: 100%;
    }
  }
`

export const ButtonList = ({ children }: PropsWithChildren) => (
  <List>
    {Children.map(children, (child, index) => (
      <ListItem key={index}>{child}</ListItem>
    ))}
  </List>
)
