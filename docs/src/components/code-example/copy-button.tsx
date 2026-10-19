"use client"
import { css, styled } from "#lib/fassade"

import { useCopy } from "../../hooks/use-copy"
import { IconButton } from "../icon-button"

const Button = styled(IconButton)(
  ({ t }) => css`
    position: relative;
    z-index: 1;
    border: none;
    border-radius: var(--radius);
    background: ${t("bg.default")};
    margin-bottom: -0.75rem;
  `,
)

interface CopyButtonProps {
  name: string
  code: string
}

export const CopyButton = ({ code, name }: CopyButtonProps) => {
  const { copy, copied } = useCopy()

  return (
    <Button
      icon={copied ? "copy-check" : "copy"}
      title={`Copy code of ${name}`}
      onClick={() => void copy(code)}
      color={copied ? "alert.success" : undefined}
    />
  )
}
