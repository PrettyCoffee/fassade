import { css, styled } from "#lib/fassade"

import { Icon, type IconProps } from "./icon"

const Button = styled
  .button<{ outlined?: boolean }>(({ t, outlined }) => [
    css`
      height: 2.5rem;
      width: 2.5rem;
      flex-shrink: 0;
      flex-grow: 0;
      background: transparent;

      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;

      &:hover {
        background: ${t("bg.alt")};
      }

      svg {
        transition:
          scale 100ms ease-out,
          stroke 200ms ease-out;
      }
      &:active svg {
        scale: 1.5 0.8;
      }
    `,
    outlined &&
      css`
        border: 1px solid ${t("stroke.gentle")};
        &:hover {
          border-color: ${t("stroke.default")};
        }
      `,
  ])
  .filterProps(["outlined"])

export interface IconButtonProps extends Pick<IconProps, "icon" | "color"> {
  onClick?: () => void
  className?: string
  title: string
  outlined?: boolean
}

export const IconButton = ({ icon, color, ...props }: IconButtonProps) => (
  <Button {...props}>
    <Icon icon={icon} color={color} size="1rem" />
  </Button>
)
