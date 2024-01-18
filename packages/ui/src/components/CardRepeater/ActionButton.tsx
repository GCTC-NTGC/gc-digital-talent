import React from "react";

import Button from "../Button/Button";

type Animation = "none" | "translate-up" | "translate-down";

export type ActionButtonProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  animation?: Animation;
};

/**
 * Generic button to apply styles to a
 * fieldset action button
 */
const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ animation = "none", disabled, ...rest }, ref) => {
    const animationStyles: Record<Animation, Record<string, string>> = {
      none: {},
      "translate-up": {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(-20%)) base:focus-visible:children[svg](translateY(-20%))",
      },
      "translate-down": {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(20%)) base:focus-visible:children[svg](translateY(20%))",
      },
    };

    return (
      <Button
        ref={ref}
        mode="icon_only"
        color="black"
        data-h2-transition="base:children[svg](transform 200ms ease)"
        disabled={disabled}
        {...(!disabled && {
          ...animationStyles[animation],
        })}
        {...rest}
      />
    );
  },
);

export default ActionButton;
