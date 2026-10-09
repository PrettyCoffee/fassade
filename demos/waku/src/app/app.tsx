import {
  Button,
  ButtonList,
  Divider,
  H1,
  H2,
  Code,
  Icon,
} from "demo-lib/components"

import { css, styled } from "../fassade"
import { Counter } from "./counter"
import { ListDivider } from "./list-divider"

const MainSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
`

const SideSection = styled.section(
  (_props, t) => css`
    flex: 1;
    padding: 32px;
    text-align: left;

    @media (max-width: 1024px) {
      padding: 24px 20px;
    }

    svg {
      margin-bottom: 16px;
      width: 22px;
      height: 22px;
      color: ${t("text.accent")};
    }
  `,
)

const Stack = styled.div`
  display: flex;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`

export const App = () => (
  <>
    <MainSection>
      <div>
        <H1>Get started</H1>
        <p>
          Edit <Code>src/App.tsx</Code> and save to test <Code>fassade</Code>
        </p>
      </div>
      <Counter />
    </MainSection>

    <Divider orientation="horizontal" />

    <Stack>
      <SideSection>
        <Icon icon="docs" />
        <H2>Ressources</H2>
        <p>Seeking more details?</p>
        <ButtonList>
          <Button
            as="a"
            href="https://prettycoffee.github.io/fassade/"
            target="_blank"
          >
            Read the docs
          </Button>
          <Button
            as="a"
            href="https://github.com/PrettyCoffee/fassade/"
            target="_blank"
          >
            Visit the repo
          </Button>
        </ButtonList>
      </SideSection>

      <ListDivider />

      <SideSection>
        <Icon icon="social" />
        <H2>Contribution</H2>
        <p>Help to improve the project</p>
        <ButtonList>
          <Button
            as="a"
            href="https://github.com/PrettyCoffee/fassade/compare"
            target="_blank"
          >
            Raise a PR
          </Button>
          <Button
            as="a"
            href="https://github.com/PrettyCoffee/fassade/issues/new"
            target="_blank"
          >
            Create an issue
          </Button>
        </ButtonList>
      </SideSection>
    </Stack>
  </>
)
