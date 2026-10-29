"use client"

import { css, styled } from "#lib/fassade"

import { type Heading } from "./get-headings"

const List = styled.ul(
  () => css`
    position: relative;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
  `,
)

const ChildList = styled(List)`
  margin-left: 0.75rem;
`

const Link = styled.a(
  ({ t }) => css`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem 0.25rem 0.75rem;
    height: 2rem;
    font-size: 0.875rem;

    color: ${t("text.gentle")};
    text-decoration: none;

    &:hover {
      color: ${t("text.default")};
    }

    &[data-active] {
      color: ${t("text.default")};
      font-weight: 700;
    }
  `,
)

const Item = ({
  id,
  text,
  level,
  children,
  activeIds,
}: Heading & { activeIds: string[] }) => (
  <li key={id}>
    <Link
      href={`#${encodeURIComponent(id)}`}
      data-level={level}
      aria-current={activeIds[0] === id ? "location" : undefined}
      data-active={activeIds.includes(id) || undefined}
    >
      {text}
    </Link>
    {children.length > 0 && (
      <ChildList>
        {children.map(props => (
          <Item key={props.id} {...props} activeIds={activeIds} />
        ))}
      </ChildList>
    )}
  </li>
)

export const NavList = {
  Item,
  Group: List,
}
