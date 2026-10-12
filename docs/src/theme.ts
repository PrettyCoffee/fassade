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

const dark = {
  text: {
    default: neutral["200"],
    gentle: neutral["400"],
    muted: neutral["600"],
  },
  bg: {
    default: neutral["900"],
  },
  stroke: {
    default: neutral["500"],
    gentle: neutral["700"],
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
  },
  stroke: {
    default: neutral["600"],
    gentle: neutral["400"],
  },
}

export const theme = createTheme(shared, { light, dark }, "dark")
