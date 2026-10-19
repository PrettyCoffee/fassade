import { createTheme } from "fassade"

const shared = {
  font: {
    sans: "Quicksand",
    mono: "Fira Code",
    head: 'system-ui, "Segoe UI", Roboto, sans-serif',
  },
}

const neutral = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#09090b",
}

const red = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
}

const lime = {
  50: "#f7fee7",
  100: "#ecfccb",
  200: "#d9f99d",
  300: "#bef264",
  400: "#a3e635",
  500: "#84cc16",
  600: "#65a30d",
  700: "#4d7c0f",
  800: "#3f6212",
  900: "#365314",
  950: "#1a2e05",
}

const dark = {
  text: {
    default: neutral["200"],
    gentle: neutral["400"],
    muted: neutral["600"],
  },
  bg: {
    default: neutral["900"],
    alt: neutral["800"],
  },
  stroke: {
    default: neutral["500"],
    gentle: neutral["700"],
  },
  alert: {
    error: red["500"],
    success: lime["400"],
  },
}

const light: typeof dark = {
  text: {
    default: neutral["900"],
    gentle: neutral["600"],
    muted: neutral["400"],
  },
  bg: {
    default: neutral["50"],
    alt: neutral["100"],
  },
  stroke: {
    default: neutral["600"],
    gentle: neutral["400"],
  },
  alert: {
    error: red["600"],
    success: lime["600"],
  },
}

export const theme = createTheme(shared, { light, dark }, "dark")
