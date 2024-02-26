import React from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import { formMessages } from "@gc-digital-talent/i18n";

import Button from "../Button";
import { useCardRepeaterContext } from "./CardRepeaterProvider";

type Animation = "none" | "translate-up" | "translate-down";

export type ActionButtonProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  animation?: Animation;
};

export const Action = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ animation = "none", disabled, ...rest }, ref) => {
    const animationStyles: Record<Animation, Record<string, string>> = {
      none: {},
      "translate-up": {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(-10%)) base:focus-visible:children[svg](translateY(-10%))",
      },
      "translate-down": {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(10%)) base:focus-visible:children[svg](translateY(10%))",
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

export const Add = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const { max, total } = useCardRepeaterContext();
  const reachedMax = Boolean(max && total >= max);

  return (
    <Button
      ref={forwardedRef}
      icon={PlusCircleIcon}
      disabled={reachedMax}
      type="button"
      mode="placeholder"
      block
      color="secondary"
      {...rest}
    >
      {reachedMax ? (
        <>{intl.formatMessage(formMessages.repeaterDeleteItem)}</>
      ) : (
        children || intl.formatMessage(formMessages.repeaterAddItem)
      )}{" "}
      {max && `(${total}/${max})`}
    </Button>
  );
});

export const Edit = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => (
  <Action ref={forwardedRef} icon={PencilSquareIcon} {...rest}>
    {children}
  </Action>
));

export const Remove = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => (
  <Action ref={forwardedRef} icon={TrashIcon} color="error" {...rest}>
    {children}
  </Action>
));
