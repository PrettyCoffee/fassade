import { getWindow } from "./get-window"

export const GOOBRRR_ID = {
  SSR: "_goobrrr__ssr",
  CSR: "_goobrrr__csr",
}

const ssrCache = { data: "" }

const getDomSheet = (id: string) =>
  getWindow()?.document.querySelector(`#${id}`)?.firstChild as Text | null

/** Returns the text node or an object for ssr environments, to collect styles. */
export const getSsrSheet = () => {
  // SSR DOM sheet can only be read in CSR and is static in CSR, so this only needs to be checked if empty
  if (!ssrCache.data) ssrCache.data = getDomSheet(GOOBRRR_ID.SSR)?.data || ""
  return ssrCache
}

export const getCsrSheet = () => {
  const existing = getDomSheet(GOOBRRR_ID.CSR)
  if (existing) return existing

  const style = document.createElement("style")
  style.id = GOOBRRR_ID.CSR
  style.innerHTML = " "
  document.head.append(style)
  return style.firstChild as Text
}

type StyleUpdate = (data: string, secondary?: string) => string
export const updateSheet = (updater: StyleUpdate) => {
  if (!getWindow()) {
    ssrCache.data = updater(ssrCache.data).trim()
  } else {
    const ssr = getSsrSheet()
    const csr = getCsrSheet()
    csr.data = updater(csr.data, ssr.data).trim()
  }
}
