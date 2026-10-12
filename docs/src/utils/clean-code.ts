export const cleanCode = (code: string) =>
  code
    // remove oxlint comments
    .replaceAll(/^.*oxlint-disable.*$/gm, "")
    .trim()
