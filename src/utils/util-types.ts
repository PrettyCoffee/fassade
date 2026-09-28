export type Resolve<T> = { [K in keyof T]: T[K] } & {}

export type Conditional<T> = T | false | null | undefined

type TemplateArgs<TValue> = [
  TemplateStringsArray | string[],
  ...values: TValue[],
]
export interface Template<TValue> {
  Value: TValue
  Args: TemplateArgs<TValue>
  Fn: (...args: TemplateArgs<TValue>) => string
}
