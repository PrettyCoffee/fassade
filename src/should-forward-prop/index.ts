/**
 * Should forward prop utility function.
 *
 * @param filterPropFunction The filter function.
 */
export function shouldForwardProp(
  filterPropFunction: (prop: string) => boolean,
) {
  /** The forward props function passed to `setup` */
  function forwardProp(props: object) {
    for (let p in props) {
      if (!filterPropFunction(p)) {
        delete props[p as keyof object]
      }
    }
  }

  return forwardProp
}
