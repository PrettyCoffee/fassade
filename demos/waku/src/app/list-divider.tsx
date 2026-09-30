"use client"

import { Divider } from "demo-lib/components"
import { useMediaQuery } from "demo-lib/hooks"

export const ListDivider = () => {
  const isMobile = useMediaQuery("(max-width: 1024px)")
  return <Divider orientation={isMobile ? "horizontal" : "vertical"} />
}
