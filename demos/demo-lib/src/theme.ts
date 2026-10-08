interface Theme {
  font: {
    sans: string
    mono: string
    head: string
  }
  text: {
    default: string
    gentle: string
    accent: string
  }
  bg: {
    default: string
    alt: string
    accent: string
    code: string
  }
  stroke: string
  shadow: string
}

export const theme: Theme = {
  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
    head: "var(--font-head)",
  },
  text: {
    default: "var(--text-default)",
    gentle: "var(--text-gentle)",
    accent: "var(--text-accent)",
  },
  bg: {
    default: "var(--bg-default)",
    alt: "var(--bg-alt)",
    accent: "var(--bg-accent)",
    code: "var(--bg-code)",
  },
  stroke: "var(--stroke)",
  shadow: "var(--shadow)",
}
