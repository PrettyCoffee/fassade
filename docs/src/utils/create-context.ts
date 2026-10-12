import { createContext as createReactContext, use } from "react"

export const createContext = <T>(name: string) => {
  const context = createReactContext<T | null>(null)
  context.displayName = `${name}Context`

  const useOptionalValue = () => use(context)
  const useRequiredValue = () => {
    const value = use(context)
    if (value == null)
      throw new Error(
        `Value of ${name}Context can only be used within a ${name}Provider`
      )
    return value
  }

  return Object.assign(context, { useOptionalValue, useRequiredValue })
}
