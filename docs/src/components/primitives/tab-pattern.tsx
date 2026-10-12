"use client"
import {
  type Dispatch,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type KeyboardEvent,
  useState,
} from "react"

import { createContext } from "../../utils/create-context"

type TabRef = RefObject<HTMLButtonElement | null>
type TabId = string | number

interface TabPatternContextState {
  baseId: string
  activeTab: TabId | undefined
  onTabChange: Dispatch<TabId | undefined>
  tabList: Record<TabId, TabRef>

  addTab: (tab: TabId, tabRef: TabRef) => void
  removeTab: (tab: TabId) => void
}

const Context = createContext<TabPatternContextState>("TabPattern")

const useTabIds = (tab: TabId) => {
  const { baseId } = Context.useRequiredValue()
  return {
    panel: `${baseId}-${tab}-panel`,
    tab: `${baseId}-${tab}-tab`,
  }
}

interface TabRootProps {
  initialTab?: TabId
}
const Root = ({ initialTab, children }: PropsWithChildren<TabRootProps>) => {
  const baseId = useId()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [tabList, setTabList] = useState<TabPatternContextState["tabList"]>({})

  const addTab = useCallback(
    (tab: TabId, tabRef: TabRef) =>
      setTabList(tabList => ({ ...tabList, [tab]: tabRef })),
    [],
  )

  const removeTab = useCallback(
    (tab: TabId) =>
      // oxlint-disable-next-line unused-imports/no-unused-vars -- explicitly used to remove this
      setTabList(({ [tab]: _removed, ...tabList }) => tabList),
    [],
  )

  const provided = useMemo<TabPatternContextState>(
    () => ({
      baseId,
      activeTab,
      tabList,
      onTabChange: setActiveTab,
      addTab,
      removeTab,
    }),
    [baseId, activeTab, tabList, addTab, removeTab],
  )

  return <Context value={provided}>{children}</Context>
}

interface TabListProps {
  label: string
  className?: string
}
const TabList = ({
  label,
  children,
  ...delegated
}: PropsWithChildren<TabListProps>) => (
  <div
    role="tablist"
    aria-orientation="horizontal"
    aria-label={label}
    {...delegated}
  >
    {children}
  </div>
)

const getTabElements = (tabList: TabPatternContextState["tabList"]) => {
  const tabRefs = Object.entries(tabList).flatMap(([id, ref]) =>
    !ref.current ? [] : { id, element: ref.current },
  )

  return tabRefs.toSorted((a, b) => {
    const rectA = a.element.getBoundingClientRect()
    const rectB = b.element.getBoundingClientRect()

    const valueA = rectA.top + rectA.left
    const valueB = rectB.top + rectB.left

    return valueA - valueB
  })
}

const getNavigableTabs = (
  tab: TabRef,
  tabList: TabPatternContextState["tabList"],
) => {
  const allTabs = getTabElements(tabList)
  const index = allTabs.findIndex(({ element }) => element === tab.current)
  return {
    first: allTabs[0],
    prev: allTabs[index - 1],
    next: allTabs[index + 1],
    last: allTabs.at(-1),
  }
}

interface TabProps {
  id: TabId
  className?: string
}

const Tab = ({ children, id, ...delegated }: PropsWithChildren<TabProps>) => {
  const { tabList, activeTab, onTabChange, addTab, removeTab } =
    Context.useRequiredValue()

  const ids = useTabIds(id)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    addTab(id, ref)
    return () => removeTab(id)
  }, [id, addTab, removeTab])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const switchTab = (target: keyof ReturnType<typeof getNavigableTabs>) => {
        const { id, element } = getNavigableTabs(ref, tabList)[target] ?? {}
        if (!element || !id) return
        element.focus()
        onTabChange(id)
      }

      const handler = {
        Home: () => switchTab("first"),
        End: () => switchTab("last"),
        ArrowLeft: () => switchTab("prev"),
        ArrowRight: () => switchTab("next"),
      }[event.key]

      if (handler) {
        handler()
        event.preventDefault()
      }
    },
    [onTabChange, tabList],
  )

  return (
    <button
      ref={ref}
      role="tab"
      id={ids.tab}
      aria-controls={ids.panel}
      aria-selected={activeTab === id}
      onClick={() => onTabChange(id)}
      onKeyDown={handleKeyDown}
      {...delegated}
    >
      {children}
    </button>
  )
}

interface PanelProps {
  id: TabId
  className?: string
}
const Panel = ({
  id,
  children,
  ...delegated
}: PropsWithChildren<PanelProps>) => {
  const ids = useTabIds(id)
  const { activeTab } = Context.useRequiredValue()

  if (activeTab !== id) return null

  return (
    <div
      role="tabpanel"
      id={ids.panel}
      aria-labelledby={ids.tab}
      {...delegated}
    >
      {children}
    </div>
  )
}

export const TabPattern = {
  Root,
  TabList,
  Tab,
  Panel,
  use: Context.useRequiredValue,
}
