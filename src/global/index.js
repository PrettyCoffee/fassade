import { css, styled } from "../index"

/**
 * CSS Global function to declare global styles.
 *
 * @type {Function}
 */
export const glob = (...args) => {
  css(...args).withConfig({ type: "global" }).class
}

/**
 * Creates the global styles component to be used as part of your tree.
 *
 * @returns {Function}
 */
export function createGlobalStyles(...args) {
  const styles = css(...args).withConfig({ type: "global" })
  return () => (styles.class, null)
}
