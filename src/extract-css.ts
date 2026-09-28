import { getSsrSheet } from "./utils/style-sheet"

/** Returns css after changes settled. */
export const extractCss = () =>
  new Promise<string>(resolve => {
    let css = getSsrSheet().data

    const resolveIfSettled = () => {
      globalThis.queueMicrotask(() => {
        const newCss = getSsrSheet().data
        if (newCss !== css) {
          css = newCss
          resolveIfSettled()
        } else {
          resolve(css)
        }
      })
    }

    resolveIfSettled()
  })
