import { getWindow } from "./get-window"

export const remToPx = (rem: number) => {
  const document = getWindow()?.document
  if (!document) return 16
  return (
    rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  )
}
