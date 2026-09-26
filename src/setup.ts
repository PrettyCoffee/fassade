import type { JSX } from "react"

interface SetupConfig {
  /**
   * JSX function to create a virtual dom node. (i.e. React.createElement or
   * Preact.h)
   */
  jsx: (type: unknown, props?: object | null, ...args: any[]) => JSX.Element
}
const setupStore: SetupConfig = {
  jsx: () => {
    throw new Error(
      "Goobrrr expected setup to provide a jsx function, but none was there. Did you call `setup({ jsx: ... })`?",
    )
  },
}

/** Configure the behavior of goobrrr. */
export const setup = ({ jsx }: Partial<SetupConfig>) => {
  if (jsx) setupStore.jsx = jsx
}

export const getSetup = () => setupStore
