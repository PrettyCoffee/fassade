import { useEffect, useState } from "react"

import { getWindow } from "../utils/get-window"

export const useMediaQuery = (queryString: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const query = getWindow()?.matchMedia(queryString)
    if (!query) return
    const update = () => setMatches(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [queryString])

  return matches
}
