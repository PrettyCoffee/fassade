export const GOOBRRR_ID = "_goobrrr"

export type Sheet = (Element | {}) & { data?: string }
const ssr: Sheet = {
  data: "",
}

const getStyleElement = () => {
  const existing = (window as { _goobrrr?: HTMLStyleElement })[GOOBRRR_ID]
  if (existing) return existing

  const style = document.createElement("style")
  style.innerHTML = " "
  style.id = GOOBRRR_ID
  return style
}

/** Returns the node to inject styles, or an ssr object, to collect styles. */
export const getSheet = (): Sheet => {
  if (typeof window === "object") {
    const style = getStyleElement()
    if (!style.parentNode) document.head.append(style)
    return style.firstChild as Element
  }

  return ssr
}
