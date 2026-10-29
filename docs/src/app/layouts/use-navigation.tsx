"use client"

import { useEffect, useState } from "react"

import { getWindow } from "../../utils/get-window"
import { remToPx } from "../../utils/rem-to-px"
import { getHeadings, type Heading } from "./get-headings"

const HEADER_HEIGHT = remToPx(4)
const H2_HEIGHT = remToPx(2.5)

const getScrollMargin = (element: HTMLElement) =>
  element.tagName === "H2"
    ? HEADER_HEIGHT
    : HEADER_HEIGHT + H2_HEIGHT + remToPx(0.5)

const getScrollParent = (target: HTMLElement) => {
  let parent = target.parentElement
  while (parent) {
    const { overflowY } = getWindow()?.getComputedStyle(parent) || {}
    if (overflowY === "auto" || overflowY === "scroll") return parent
    parent = parent.parentElement
  }
  return getWindow()
}

const getVisible = (window: Window, elements: HTMLElement[]) => {
  const first = elements.find((element, index) => {
    const next = elements[index + 1]
    const offset = getScrollMargin(element)
    return !next || next.getBoundingClientRect().top > offset
  })
  if (!first) return { start: 0, end: 0, ids: [] }

  const start = elements.indexOf(first)

  const visible = elements
    .slice(start)
    .filter(element => element.getBoundingClientRect().top < window.innerHeight)

  const last = visible.at(-1) ?? first
  const end = elements.indexOf(last)
  return { start, end, ids: visible.map(({ id }) => id) }
}

export const useNavigation = () => {
  const [tree, setTree] = useState<Heading[]>([])
  const [elements, setElements] = useState<HTMLHeadingElement[]>([])
  const [visible, setVisible] = useState({
    start: 0,
    end: 0,
    ids: [] as string[],
  })

  useEffect(() => {
    const window = getWindow()
    const main = window?.document.querySelector("main")
    if (!window || !main) return

    const updateVisible = () =>
      setVisible(getVisible(window, getHeadings(main).elements))

    const updateHeadings = () => {
      const { elements, headings } = getHeadings(main)
      elements.forEach(
        element =>
          (element.style.scrollMarginTop = getScrollMargin(element) + "px"),
      )
      setTree(headings)
      setElements(elements)

      updateVisible()
    }

    updateHeadings()

    const scrollTarget = getScrollParent(main) ?? window
    scrollTarget.addEventListener("scroll", updateVisible, { passive: true })
    window.addEventListener("resize", updateVisible)

    const mutation = new MutationObserver(updateHeadings)
    mutation.observe(main, { childList: true })

    return () => {
      window.removeEventListener("resize", updateVisible)
      scrollTarget.removeEventListener("scroll", updateVisible)
      mutation.disconnect()
    }
  }, [])

  return { tree, elements, visible }
}
