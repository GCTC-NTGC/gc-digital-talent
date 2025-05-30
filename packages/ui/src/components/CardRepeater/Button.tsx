/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { formMessages } from "@gc-digital-talent/i18n";

import Button from "../Button";
import { useCardRepeaterContext } from "./CardRepeaterProvider";
import IconButton from "../Button/IconButton";

const action = tv({
  base: "[&_svg]:ease [&_svg]:transform [&_svg]:transition [&_svg]:duration-200",
  variants: {
    animation: {
      none: "",
      "translate-up":
        "[&_svg]:translate-y-0 hover:[&_svg]:-translate-y-0.5 focus-visible:[&_svg]:-translate-y-0.5",
      "translate-down":
        "[&_svg]:translate-y-0 hover:[&_svg]:translate-y-0.5 focus-visible:[&_svg]:translate-y-0.5",
    },
  },
});

type ActionVariants = VariantProps<typeof action>;

interface ActionButtonProps
  extends ActionVariants,
    ComponentPropsWithoutRef<typeof IconButton> {}

export const Action = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ animation = "none", disabled, ...rest }, ref) => {
    return (
      <IconButton
        ref={ref}
        color="black"
        className={action({ animation: disabled ? undefined : animation })}
        disabled={disabled}
        {...rest}
      />
    );
  },
);

export const Add = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Button>
>(({ children, disabled, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const { max, total } = useCardRepeaterContext();
  const reachedMax = Boolean(max && total >= max);

  return (
    <Button
      ref={forwardedRef}
      icon={PlusCircleIcon}
      disabled={reachedMax || disabled}
      type="button"
      mode="placeholder"
      block
      color="secondary"
      {...rest}
    >
      {reachedMax ? (
        <>{intl.formatMessage(formMessages.repeaterDeleteItem)}</>
      ) : (
        (children ?? intl.formatMessage(formMessages.repeaterAddItem))
      )}{" "}
      {max && `(${total}/${max})`}
    </Button>
  );
});

export const Edit = forwardRef<
  HTMLButtonElement,
  Omit<ComponentPropsWithoutRef<typeof IconButton>, "icon">
>(({ ...rest }, forwardedRef) => (
  <Action ref={forwardedRef} icon={PencilSquareIcon} {...rest} />
));

export const Remove = forwardRef<
  HTMLButtonElement,
  Omit<ComponentPropsWithoutRef<typeof IconButton>, "icon">
>(({ ...rest }, forwardedRef) => (
  <Action ref={forwardedRef} icon={TrashIcon} color="error" {...rest} />
));
