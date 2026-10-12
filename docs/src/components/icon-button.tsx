import { css, styled } from "#lib/fassade"

import { Icon, type IconProps } from "./icon"

const Button = styled.button(
  ({ t }) => css`
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    flex-grow: 0;
    background: transparent;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    border: 1px solid ${t("stroke.gentle")};
    &:hover {
      border-color: ${t("stroke.default")};
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
)

export interface IconButtonProps extends Pick<IconProps, "icon" | "color"> {
  onClick?: () => void
  className?: string
  title: string
}

export const IconButton = ({ icon, color, ...props }: IconButtonProps) => (
  <Button {...props}>
    <Icon icon={icon} color={color} size="1rem" />
  </Button>
)
