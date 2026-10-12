import { type ReactNode } from "react"

import { css, styled } from "#lib/fassade"

import { HBorder } from "../border"
import { IconButton, type IconButtonProps } from "../icon-button"
import { TabPattern } from "../primitives/tab-pattern"

const TabsHeader = styled.div(
  ({ t }) => css`
    position: sticky;
    top: 0;
    z-index: 2;
    backdrop-filter: blur(2px);
    background-color: color-mix(in srgb, ${t("bg.default")} 80%, transparent);
  `,
)

const ButtonList = styled.div`
  display: flex;
`

const FlexSpacer = styled.div`
  flex: 1;
`

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

interface CodeAction extends Pick<IconButtonProps, "icon" | "color"> {
  title: string
  onClick?: (active: string) => void
}
const TabActions = ({ actions }: { actions: CodeAction[] }) => {
  const { activeTab } = TabPattern.use()
  return (
    <>
      {actions.map(action => (
        <IconButton
          {...action}
          key={action.title}
          onClick={() => activeTab && action.onClick?.(activeTab)}
        />
      ))}
    </>
  )
}

interface CodeTabsProps {
  tabs: Record<string, ReactNode>
  actions: CodeAction[]
}

export const CodeTabs = ({ tabs, actions }: CodeTabsProps) => (
  <TabPattern.Root initialTab={Object.keys(tabs)[0]}>
    <TabsHeader>
      <ButtonList>
        <TabPattern.TabList label="Code example tabs">
          {Object.keys(tabs).map(name => (
            <TabButton key={name} id={name}>
              {name}
            </TabButton>
          ))}
        </TabPattern.TabList>
        <FlexSpacer />

        <TabActions actions={actions} />
      </ButtonList>

      <HBorder />
    </TabsHeader>

    {Object.entries(tabs).map(([name, content]) => (
      <TabPattern.Panel key={name} id={name}>
        {content}
      </TabPattern.Panel>
    ))}
  </TabPattern.Root>
)
