import React from "react";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getButtonStyles from "../../utils/button/getButtonStyles";

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
      fontSize = "body",
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
        {...getButtonStyles({ mode, color, block, disabled })}
        {...rest}
      >
        <ButtonLinkContent
          mode={mode}
          icon={icon}
          utilityIcon={utilityIcon}
          color={color}
          counter={counter}
          fontSize={fontSize}
        >
          {children}
        </ButtonLinkContent>
      </button>
    );
  },
);

export default Button;
