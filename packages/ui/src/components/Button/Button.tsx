import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";

import { btn, BaseButtonLinkProps } from "../../utils/btnStyles";

export interface ButtonProps
  extends BaseButtonLinkProps,
    Omit<
      DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "color"
    > {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "primary",
      mode = "solid",
      size = "md",
      block = false,
      disabled = false,
      icon,
      utilityIcon,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const Icon = icon;
    const UtilityIcon = utilityIcon;
    const { base, leadingIcon, trailingIcon, label, content } = btn({
      color,
      block,
      mode,
      size,
      disabled,
    });
    return (
      <button
        ref={forwardedRef}
        className={base({ class: className })}
        disabled={disabled}
        {...rest}
      >
        <span className={content()}>
          {Icon && <Icon className={leadingIcon()} />}
          <span className={label()}>{children}</span>
          {UtilityIcon && <UtilityIcon className={trailingIcon()} />}
        </span>
      </button>
    );
  },
);

export default Button;
