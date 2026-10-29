"use client"

import { useEffect } from "react"

import { Icon } from "#components"
import { css, styled } from "#lib/fassade"

import { getWindow } from "../../utils/get-window"
import { NavList } from "./nav-list"
import { NavListRail } from "./nav-list-rail"
import { useNavigation } from "./use-navigation"

const Label = styled.div(
  ({ t }) => css`
    color: ${t("text.gentle")};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  `,
)

export const Navigation = () => {
  const nav = useNavigation()

  useEffect(() => {
    const window = getWindow()
    if (!window) return
    const hashId = window.location.hash.slice(1)
    window.document.getElementById(hashId)?.scrollIntoView()
  }, [])

  if (nav.elements.length === 0) return null

  return (
    <nav>
      <Label>
        <Icon icon="list-tree" color="stroke.gentle" /> On this page
      </Label>
      <NavList.Group>
        <NavListRail {...nav} />
        {nav.tree.map(heading => (
          <NavList.Item
            key={heading.id}
            {...heading}
            activeIds={nav.visible.ids}
          />
        ))}
      </NavList.Group>
    </nav>
  )
}
