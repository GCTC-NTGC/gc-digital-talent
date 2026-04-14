import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef } from "react";

import type { BaseIconButtonLinkProps } from "../../utils/btnStyles";
import { iconBtn } from "../../utils/btnStyles";

export interface IconButtonProps
  extends
    BaseIconButtonLinkProps,
    Omit<
      DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "color" | "aria-label"
    > {}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      color = "primary",
      size = "md",
      disabled,
      icon,
      label,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const Icon = icon;
    const { base, icon: iconStyles } = iconBtn({ color, size, disabled });
    return (
      <button
        ref={forwardedRef}
        aria-label={label}
        className={base({ class: className })}
        disabled={disabled}
        {...rest}
      >
        {children && <span className="sr-only">{children}</span>}
        <Icon className={iconStyles()} />
      </button>
    );
  },
);

export default IconButton;
