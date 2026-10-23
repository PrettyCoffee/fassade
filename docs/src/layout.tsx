import { type PropsWithChildren } from "react"

import { HBorder } from "#components"
import { css, styled } from "#lib/fassade"

const FullHeight = styled.div(
  ({ t }) => css`
    display: flex;
    flex-direction: column;
    height: 100%;
    border-inline: 1px solid ${t("stroke.gentle")};
    margin: 0 0.5rem;
  `,
)

const Header = styled.header(
  ({ t }) => css`
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 1000;

    backdrop-filter: blur(2px);
    background-color: color-mix(in srgb, ${t("bg.default")} 50%, transparent);
    height: 4rem;
  `,
)

const HeaderBorder = styled(HBorder)`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
`

const HeaderContent = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  overflow: hidden;
`

const Headline = styled.h1(
  ({ t }) => css`
    font-size: 5rem;
    font-weight: 700;
    font-style: italic;
    margin: 0;
    color: ${t("text.muted")};
    text-transform: uppercase;

    @media (prefers-reduced-motion: no-preference) {
      transition: 1s cubic-bezier(0.48, 0.63, 0.43, 1.24);
      transition-property: letter-spacing, translate;
      @starting-style {
        letter-spacing: 30rem;
        translate: 100vw 0;
      }
    }
  `,
)

export const Layout = ({ children }: PropsWithChildren) => (
  <FullHeight>
    <Header>
      <HeaderContent>
        <Headline>Fassade</Headline>
      </HeaderContent>
      <HeaderBorder />
    </Header>

    {children}
  </FullHeight>
)
