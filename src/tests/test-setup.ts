import { afterEach } from "vitest"

import { setup, type Theme } from "../setup"
import { resetStyleCache } from "../utils/hash"
import { getCsrSheet, getSsrSheet, FASSADE_ID } from "../utils/style-sheet"

const resetCaches = () => {
  resetStyleCache()
  getSsrSheet().data = " "
  getCsrSheet()!.data = " "
  document.getElementById(FASSADE_ID.CSR)?.remove()
  document.getElementById(FASSADE_ID.SSR)?.remove()
}

// oxlint-disable-next-line vitest/require-top-level-describe -- this is a global afterEach
afterEach(() => {
  resetCaches()
  setup({ theme: null as Theme })
})
