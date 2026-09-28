import { useCallback, useMemo, useSyncExternalStore } from "react"

export const useMediaQuery = (queryString: string) => {
  const query = useMemo(() => window.matchMedia(queryString), [queryString])

  const getSnapshot = useCallback(() => query.matches, [query])

  const subscribe = useCallback(
    (cb: () => void) => {
      query.addEventListener("change", cb)
      return () => query.removeEventListener("change", cb)
    },
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot)
}
