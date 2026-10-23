import { type PropsWithChildren } from "react"

import { css, styled } from "#lib/fassade"

const Grid = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const Side = styled.aside`
  position: sticky;
  width: 15rem;
  top: 4rem;
  padding: 0.5rem 0.75rem;
  align-self: start;
`

const Main = styled.main(
  ({ t }) => css`
    border-right: 1px solid ${t("stroke.gentle")};
    padding-bottom: 2rem;
    flex: 1;
  `,
)

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
`

export const LayoutWithNav = ({ children }: PropsWithChildren) => (
  <Grid>
    <Side>
      <nav>
        <p>Side content</p>
      </nav>
    </Side>

    <Main>
      <MainLayout>{children}</MainLayout>
    </Main>
  </Grid>
)
