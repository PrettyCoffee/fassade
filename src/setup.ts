import type { JSX } from "react"

import { minify, type Plugin } from "./plugins"

// oxlint-disable-next-line typescript/no-empty-interface -- can be extended by users
export interface SetupConfig {}

interface Setup {
  theme: Readonly<Theme>
  /**
   * JSX function to create a virtual dom node. (i.e. React.createElement or
   * Preact.h)
   */
  jsx: (type: unknown, props?: object | null, ...args: any[]) => JSX.Element
  /** List of fassade plugins. */
  plugins: Plugin[]
}
const setupStore: Setup = {
  theme: null as never,
  plugins: [minify()],
  jsx: () => {
    throw new Error(
      "Fassade expected setup to provide a jsx function, but none was there. Did you call `setup({ jsx: ... })`?",
    )
  },
}

/** Configure the behavior of fassade. */
export const setup = ({ theme, jsx, plugins }: Partial<Setup>) => {
  // oxlint-disable-next-line typescript/no-unnecessary-condition -- Theme type can be changed by user
  if (theme) setupStore.theme = theme
  if (jsx) setupStore.jsx = jsx
  if (plugins) setupStore.plugins = plugins
}

export const getSetup = () => setupStore

export type Theme = SetupConfig extends { theme: infer Theme } ? Theme : never
export const getTheme = () => getSetup().theme
