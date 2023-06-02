import React from "react";

import { Color, ButtonLinkMode } from "../../types";
import useCommonButtonLinkStyles from "../../hooks/useCommonButtonLinkStyles";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** The style type of the element. */
  color?: Color;
  /** The style mode of the element. */
  mode?: ButtonLinkMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      color = "primary",
      mode = "solid",
      disabled,
      block = false,
      ...rest
    },
    ref,
  ) => {
    const styles = useCommonButtonLinkStyles({
      mode,
      color,
      block,
    });
    let underline = {};
    if (mode === "inline") {
      underline = { "data-h2-text-decoration": "base(underline)" };
    }

    return (
      <button
        ref={ref}
        // eslint-disable-next-line react/button-has-type
        type={type || "button"}
        disabled={disabled}
        {...styles}
        {...underline}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default Button;
