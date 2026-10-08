import { createTheme } from "goobrrr"

const shared = {
  font: {
    sans: 'system-ui, "Segoe UI", Roboto, sans-serif',
    mono: 'system-ui, "Segoe UI", Roboto, sans-serif',
    head: "ui-monospace, Consolas, monospace",
  },
}

const dark = {
  text: {
    default: "#f3f4f6",
    gentle: "#9ca3af",
    accent: "#c084fc",
  },
  bg: {
    default: "#16171d",
    alt: "rgba(47, 48, 58, 0.5)",
    accent: "rgba(192, 132, 252, 0.15)",
    code: "#1f2028",
  },
  stroke: "#2e303a",
  shadow:
    "rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px",
}

const light: typeof dark = {
  text: {
    default: "#08060d",
    gentle: "#6b6375",
    accent: "#aa3bff",
  },
  bg: {
    default: "#fff",
    alt: "rgba(244, 243, 236, 0.5)",
    accent: "rgba(170, 59, 255, 0.1)",
    code: "#f4f3ec",
  },
  stroke: "#e5e4e7",
  shadow:
    "rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px",
}

export const theme = createTheme(shared, { light, dark }, "dark")
