import { afterEach } from "vitest"

import { resetHashCache } from "../utils/hash"
import { getCsrSheet, getSsrSheet, GOOBRRR_ID } from "../utils/style-sheet"

const resetCaches = () => {
  resetHashCache()
  getSsrSheet().data = " "
  getCsrSheet().data = " "
  document.getElementById(GOOBRRR_ID.CSR)?.remove()
  document.getElementById(GOOBRRR_ID.SSR)?.remove()
}

// oxlint-disable-next-line vitest/require-top-level-describe -- this is a global afterEach
afterEach(() => {
  resetCaches()
})
