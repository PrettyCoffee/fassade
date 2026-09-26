import { css, styled } from "#lib/goobrrr"

interface ButtonProps {
  look?: "primary" | "secondary"
  as?: "button" | "a"
  onClick?: () => void
  href?: string
  target?: "_self" | "_blank"
}

export const Button = styled.button<ButtonProps>(({ look = "secondary" }) => [
  css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    font-size: 16px;
    line-height: 1;
    padding: 10px 12px;
    border: 2px solid transparent;

    border-radius: 6px;
    text-decoration: none;
    outline: none;
    cursor: pointer;

    transition:
      border-color 0.3s,
      box-shadow 0.3s;
    &:hover,
    &:focus-visible {
      border-color: color-mix(in srgb, currentColor 50%, transparent);
      box-shadow: var(--shadow);
    }
  `,
  look === "primary"
    ? css`
        color: var(--accent);
        background: var(--accent-bg);
      `
    : css`
        color: var(--text-head);
        background: var(--social-bg);
      `,
])
