import { type ReactNode } from "react"

import { css, styled } from "#lib/fassade"

import { HBorder } from "../border"
import { TabPattern } from "../primitives/tab-pattern"

const TabList = styled(TabPattern.TabList)(
  ({ t }) => css`
    position: sticky;
    top: 0;
    z-index: 2;
    backdrop-filter: blur(2px);
    background-color: color-mix(in srgb, ${t("bg.default")} 80%, transparent);
  `,
)

const TabButton = styled(TabPattern.Tab)(
  ({ t }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 1rem;
    background: transparent;
    cursor: pointer;

    color: ${t("text.gentle")};
    &[aria-selected="true"] {
      color: ${t("text.default")};
    }

    border: 1px solid ${t("stroke.gentle")};
    &:hover {
      border-color: ${t("stroke.default")};
    }
  `,
)

interface CodeTabsProps {
  tabs: Record<string, ReactNode>
}

export const CodeTabs = ({ tabs }: CodeTabsProps) => (
  <TabPattern.Root initialTab={Object.keys(tabs)[0]}>
    <TabList label="Code example tabs">
      {Object.keys(tabs).map(name => (
        <TabButton key={name} id={name}>
          {name}
        </TabButton>
      ))}
      <HBorder />
    </TabList>

    {Object.entries(tabs).map(([name, content]) => (
      <TabPattern.Panel key={name} id={name}>
        {content}
      </TabPattern.Panel>
    ))}
  </TabPattern.Root>
)
