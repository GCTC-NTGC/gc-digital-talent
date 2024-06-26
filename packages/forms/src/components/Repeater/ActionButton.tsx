import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";

type Animation = "none" | "translate-up" | "translate-down";

type ActionButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  animation?: Animation;
};

/**
 * Generic button to apply styles to a
 * fieldset action button
 */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
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
      <button
        ref={ref}
        type="button"
        data-h2-border="base(none)"
        data-h2-radius="base(50%)"
        data-h2-cursor="base(pointer)"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-padding="base(x.5)"
        data-h2-background-color="base(foreground) base:hover(gray.lightest) base:focus(focus)"
        data-h2-transition="base:children[svg](transform 200ms ease)"
        data-h2-font-weight="base(700)"
        {...(disabled
          ? {
              disabled: true,
              "data-h2-color": "base(gray.dark) base:dark(gray)",
              "data-h2-background-color": "base(foreground)",
            }
          : {
              "data-h2-color": "base(black)",
              ...animationStyles[animation],
            })}
        {...rest}
      />
    );
  },
);

export default ActionButton;
