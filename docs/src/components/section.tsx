import { type PropsWithChildren } from "react"

import { css, styled } from "#lib/fassade"

import { HBorder } from "./border"

const contentWidth = css`
  width: 100%;
  max-width: 50rem;
  margin: 0 auto;
  padding: 0 1rem;
`

const H2 = styled.h2(
  ({ t }) => css`
    ${contentWidth}
    font-family: ${t("font.mono")};
    font-size: 1rem;
    text-transform: uppercase;
  `,
)

const StickyHead = styled.div(
  ({ t }) => css`
    position: sticky;
    top: 4rem;
    z-index: 2;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    backdrop-filter: blur(2px);
    background-color: color-mix(in srgb, ${t("bg.default")} 50%, transparent);
  `,
)

const Index = styled.span(
  ({ t }) => css`
    color: ${t("text.muted")};
    font-family: ${t("font.mono")};

    &::after {
      content: "/";
      margin: 0 0.5rem;
    }
  `,
)

const HBorderAligned = styled(HBorder)`
  margin-top: -1px;
`
const Head = ({ index, children }: PropsWithChildren<{ index: number }>) => (
  <StickyHead className="full-width">
    <HBorderAligned />
    <H2>
      <Index>{String(index).padStart(2, "0")}</Index>
      {children}
    </H2>
    <HBorder />
  </StickyHead>
)

const Content = styled.div`
  padding: 1rem 0 2rem 0;

  > :not(.full-width) {
    ${contentWidth}
  }
`

interface SectionProps {
  index: number
  title: string
}
export const Section = ({
  index,
  title,
  children,
}: PropsWithChildren<SectionProps>) => (
  <section>
    <Head index={index}>{title}</Head>
    <Content>{children}</Content>
  </section>
)
