import React from "react";

import IconText from "../IconText/IconText";
import { Color, ButtonLinkMode, IconType } from "../../types";
import useCommonButtonLinkStyles from "../../hooks/useCommonButtonLinkStyles";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  /** The style type of the element. */
  color?: Color;
  /** The style mode of the element. */
  mode?: ButtonLinkMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  disabled?: boolean;
  icon?: IconType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled,
      icon,
      color = "primary",
      mode = "solid",
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

    return (
      // eslint-disable-next-line react/button-has-type
      <button ref={ref} disabled={disabled} {...styles} {...rest}>
        <IconText icon={icon}>{children}</IconText>
      </button>
    );
  },
);

export default Button;
