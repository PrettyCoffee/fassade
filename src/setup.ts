import type { JSX } from "react"

import { minify, type Plugin } from "./plugins"

interface SetupConfig {
  /**
   * JSX function to create a virtual dom node. (i.e. React.createElement or
   * Preact.h)
   */
  jsx: (type: unknown, props?: object | null, ...args: any[]) => JSX.Element
  /** List of goobrrr plugins. */
  plugins: Plugin[]
}
const setupStore: SetupConfig = {
  plugins: [minify()],
  jsx: () => {
    throw new Error(
      "Goobrrr expected setup to provide a jsx function, but none was there. Did you call `setup({ jsx: ... })`?",
    )
  },
}

/** Configure the behavior of goobrrr. */
export const setup = ({ jsx, plugins }: Partial<SetupConfig>) => {
  if (jsx) setupStore.jsx = jsx
  if (plugins) setupStore.plugins = plugins
}

export const getSetup = () => setupStore
