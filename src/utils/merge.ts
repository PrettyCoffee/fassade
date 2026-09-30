import { type Conditional } from "./util-types"

const innerMerge = <T>(a: T, b: T) => {
  if (!a || typeof a !== "object") return structuredClone(b)
  if (!b || typeof b !== "object") return b
  return Object.entries(b).reduce((merged, [key, value]) => {
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    merged[key as keyof T] = innerMerge(merged[key as keyof T], value)
    return merged
  }, a)
}

export const merge = <T extends object>(
  ...[base, ...items]: Conditional<T>[]
): T => {
  if (!base) return {} as T
  return items.reduce<T>(
    (merged, insert) => (!insert ? merged : innerMerge(merged, insert)),
    structuredClone(base),
  )
}
