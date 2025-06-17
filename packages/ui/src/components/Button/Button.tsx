import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";

import { btn, BaseButtonLinkProps } from "../../utils/btnStyles";
import Counter from "./Counter";

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
      fixedColor = false,
      noUnderline = false,
      icon,
      utilityIcon,
      counter,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const Icon = icon;
    const UtilityIcon = utilityIcon;
    const {
      base,
      alignment,
      leadingIcon,
      trailingIcon,
      label,
      counter: counterStyles,
    } = btn({
      color,
      block,
      mode,
      size,
      disabled,
      fixedColor,
      noUnderline,
    });
    return (
      <button
        ref={forwardedRef}
        className={base({ class: className })}
        disabled={disabled}
        {...rest}
      >
        <span className={alignment()}>
          {Icon && <Icon className={leadingIcon()} />}
          {children && <span className={label()}>{children}</span>}
          {UtilityIcon && <UtilityIcon className={trailingIcon()} />}
          {counter && <Counter count={counter} className={counterStyles()} />}
        </span>
      </button>
    );
  },
);

export default Button;
