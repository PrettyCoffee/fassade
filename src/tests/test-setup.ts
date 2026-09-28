import { afterEach } from "vitest"

import { GOOBRRR_ID } from "../utils/get-sheet"
import { resetHashCache } from "../utils/hash"

const resetCaches = () => {
  resetHashCache()
  document.getElementById(GOOBRRR_ID)?.remove()
}

// oxlint-disable-next-line vitest/require-top-level-describe -- this is a global afterEach
afterEach(() => {
  resetCaches()
})
