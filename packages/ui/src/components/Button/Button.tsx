import React from "react";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getButtonStyle from "../../hooks/Button/getButtonStyles";

export type ButtonProps = ButtonLinkProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      icon,
      utilityIcon,
      disabled,
      counter,
      color = "primary",
      mode = "solid",
      block = false,
      ...rest
    },
    ref,
  ) => {
    // Note: Can we replace this with conditional props?
    if (!icon && mode === "cta") {
      throw new Error("Icon is required when mode is set to 'cta'");
    }

    return (
      // eslint-disable-next-line react/button-has-type
      <button
        ref={ref}
        disabled={disabled}
        {...getButtonStyle({ mode, color, block, disabled })}
        {...rest}
      >
        <ButtonLinkContent
          mode={mode}
          icon={icon}
          utilityIcon={utilityIcon}
          color={color}
          counter={counter}
        >
          {children}
        </ButtonLinkContent>
      </button>
    );
  },
);

export default Button;
