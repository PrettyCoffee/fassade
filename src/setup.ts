import type { JSX } from "react"

import { minify, type Plugin } from "./plugins"

// oxlint-disable-next-line typescript/no-empty-interface -- can be extended by users
export interface SetupConfig {}

export type Theme = SetupConfig extends { theme: infer Theme }
  ? Theme
  : object | undefined
export type ThemePropName = SetupConfig extends {
  themePropName: infer ThemePropName
}
  ? ThemePropName
  : "theme"

interface Setup {
  theme: Readonly<Theme>
  themePropName: ThemePropName
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
  themePropName: "theme",
  plugins: [minify()],
  jsx: () => {
    throw new Error(
      "Fassade expected setup to provide a jsx function, but none was there. Did you call `setup({ jsx: ... })`?",
    )
  },
}

/** Configure the behavior of fassade. */
export const setup = ({
  theme,
  themePropName,
  jsx,
  plugins,
}: Partial<Setup>) => {
  if (theme) setupStore.theme = theme
  if (themePropName) setupStore.themePropName = themePropName
  if (jsx) setupStore.jsx = jsx
  if (plugins) setupStore.plugins = plugins
}

export const getSetup = () => setupStore

export type WithTheme<TProps> = TProps & Record<ThemePropName, Theme>
export const getTheme = () => getSetup().theme
export const withTheme = <TProps>(props: TProps): WithTheme<TProps> => {
  const theme = getTheme()
  return !theme
    ? (props as WithTheme<TProps>)
    : { ...props, [getSetup().themePropName]: theme }
}
