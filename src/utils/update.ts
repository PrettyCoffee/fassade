import { getSheet, type Sheet } from "./get-sheet"

/** Extracts and wipes the cache. */
export const extractCss = () => {
  const sheet = getSheet()
  const out = sheet.data
  sheet.data = ""
  return out
}

/** Updates the target and keeps a local cache. */
export const update = (
  css: string,
  sheet: Sheet,
  append?: boolean,
  cssToReplace?: string,
) => {
  if (cssToReplace) {
    sheet.data = sheet.data?.replace(cssToReplace, css)
  } else if (!sheet.data?.includes(css)) {
    sheet.data = append ? css + sheet.data : sheet.data + css
  }
}
