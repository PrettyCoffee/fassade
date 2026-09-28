/**
 * Transforms the input into a className. The multiplication constant 101 is
 * selected to be a prime, as is the initial value of 11. The intermediate and
 * final results are truncated into 32-bit unsigned integers.
 */
export const toHash = (string: string) =>
  "go" +
  // eslint-disable-next-line @typescript-eslint/no-misused-spread eslint/no-bitwise
  [...string].reduce((out, char) => (101 * out + char.charCodeAt(0)) >>> 0, 11)
