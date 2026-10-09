import { getWindow } from "./get-window"

export const FASSADE_ID = {
  SSR: "_fassade__ssr",
  CSR: "_fassade__csr",
}

const ssrCache = { data: "" }

const document = getWindow()?.document

const getDomSheet = (id: string) =>
  document?.querySelector(`#${id}`)?.firstChild as Text | null

/** Returns the text node or an object for ssr environments, to collect styles. */
export const getSsrSheet = () => {
  // SSR DOM sheet can only be read in CSR and is static in CSR, so this only needs to be checked if empty
  if (!ssrCache.data) ssrCache.data = getDomSheet(FASSADE_ID.SSR)?.data || ""
  return ssrCache
}

export const getCsrSheet = () => {
  const existing = getDomSheet(FASSADE_ID.CSR)
  if (!document || existing) return existing

  const style = document.createElement("style")
  style.id = FASSADE_ID.CSR
  style.innerHTML = " "
  document.head.append(style)
  return style.firstChild as Text
}

type StyleUpdate = (data: string, secondary?: string) => string
export const updateSheet = (updater: StyleUpdate) => {
  const ssr = getSsrSheet()
  const csr = getCsrSheet()
  if (!csr) {
    ssr.data = updater(ssrCache.data).trim()
  } else {
    csr.data = updater(csr.data, ssr.data).trim()
  }
}
