import { css, styled } from "#lib/fassade"

import { cleanCode } from "../../utils/clean-code"
import { Code } from "../code"
import { CopyButton } from "./copy-button"

const Layout = styled.div`
  position: relative;
  padding-top: 1.5rem;
`

const Figure = styled.figure(
  ({ t }) => css`
    --border-width: 1px;
    --border: var(--border-width) solid ${t("stroke.gentle")};
    --radius: 0.5rem;

    position: relative;
    margin: 0;
    padding: 0.75rem 1rem;
    background-color: ${t("bg.default")};
    border: var(--border);
    border-bottom-left-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  `,
)

const Caption = styled.figcaption(
  ({ t }) => css`
    position: absolute;
    bottom: 100%;
    left: calc(-1 * var(--border-width));
    padding: 0.25rem 0.5rem 0;
    background-color: ${t("bg.default")};
    color: ${t("text.gentle")};

    border: var(--border);
    border-bottom: none;
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 100%;
      height: calc(1.5 * var(--radius));
      width: calc(1.5 * var(--radius));

      border-bottom: var(--border);
      border-left: var(--border);
      border-bottom-left-radius: var(--radius);
      box-shadow: calc(-0.5 * var(--radius)) calc(0.5 * var(--radius)) 0 0
        ${t("bg.default")};
    }
  `,
)

const CopyButtonPosition = styled.div(
  ({ t }) => css`
    position: absolute;
    top: -1.5rem;
    right: calc(-0.8 * var(--border-width));

    border: var(--border);
    border-bottom: none;
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);

    &::before {
      content: "";
      position: absolute;
      top: 0.58rem;
      right: 100%;
      height: 0.8625rem;
      width: 0.8625rem;

      border-bottom: var(--border);
      border-right: var(--border);
      border-bottom-right-radius: var(--radius);
      box-shadow: 0.4rem 0.4rem 0 0 ${t("bg.default")};
    }
  `,
)

interface CodeFileProps {
  name: string
  code: string
}

export const CodeExample = ({ code, name }: CodeFileProps) => {
  const cleaned = cleanCode(code)
  return (
    <Layout>
      <Figure>
        <Caption>{name}</Caption>

        <CopyButtonPosition>
          <CopyButton name={name} code={cleaned} />
        </CopyButtonPosition>

        <Code code={cleaned} />
      </Figure>
    </Layout>
  )
}
