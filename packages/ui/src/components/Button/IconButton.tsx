import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import { BaseIconButtonLinkProps, iconBtn } from "../../utils/btnStyles";

export interface IconButtonProps
  extends BaseIconButtonLinkProps,
    Omit<
      DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "color" | "children" | "aria-label"
    > {}

const IconButton = ({
  color = "primary",
  size = "md",
  icon,
  label,
  className,
  ...rest
}: IconButtonProps) => {
  const Icon = icon;
  const { base, icon: iconStyles } = iconBtn({ color, size });
  return (
    <button aria-label={label} className={base({ class: className })} {...rest}>
      <Icon className={iconStyles()} />
    </button>
  );
};

export default IconButton;
