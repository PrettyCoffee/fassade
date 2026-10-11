import { type PropsWithChildren } from "react"

import { HBorder } from "#components"
import { css, styled } from "#lib/fassade"

const Grid = styled.div(
  ({ t }) => css`
    border-inline: 1px solid ${t("stroke.gentle")};
    margin: 0 0.5rem;

    display: grid;
    grid-template:
      "header header" auto
      "main side" 1fr / 1fr 15rem;
  `,
)

const Header = styled.header(
  ({ t }) => css`
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 1000;

    background: ${t("bg.default")};
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

const Side = styled.aside`
  grid-area: side;
  position: sticky;
  top: 4rem;
  padding: 1rem;
  align-self: start;
`

const Main = styled.main(
  ({ t }) => css`
    grid-area: main;
    border-right: 1px solid ${t("stroke.gentle")};
    padding: 0rem 2rem 2rem 2rem;
  `,
)

const MainLayout = styled.div`
  width: 100%;
  max-width: 80ch;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const ScrollGradient = styled.div(
  ({ t }) => css`
    position: sticky;
    top: 4rem;
    width: 100%;
    height: 2rem;
    z-index: 1000;
    background: linear-gradient(
      to bottom,
      ${t("bg.default")} 0.125rem,
      transparent
    );
  `,
)

export const Layout = ({ children }: PropsWithChildren) => (
  <Grid>
    <Header>
      <HeaderContent>
        <Headline>Fassade</Headline>
      </HeaderContent>
      <HeaderBorder />
    </Header>

    <Side>
      <nav>
        <p>Side content</p>
      </nav>
    </Side>

    <Main>
      <ScrollGradient />
      <MainLayout>{children}</MainLayout>
    </Main>
  </Grid>
)
