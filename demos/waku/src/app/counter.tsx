"use client"

import { useState } from "react"

import { Button } from "demo-lib/components"

export const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <Button look="primary" onClick={() => setCount(count => count + 1)}>
      Count is {count}
    </Button>
  )
}
