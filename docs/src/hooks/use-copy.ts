import { useRef, useState } from "react"

import { getWindow } from "../utils/get-window"

export const useCopy = () => {
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef(0)

  const copy = async (text: string) => {
    const window = getWindow()
    if (!window) return

    window.clearTimeout(copyTimeout.current)

    await window.navigator.clipboard.writeText(text)
    setCopied(true)

    copyTimeout.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return { copied, copy }
}
