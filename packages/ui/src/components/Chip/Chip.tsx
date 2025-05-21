import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { useIntl } from "react-intl";
import { tv, type VariantProps } from "tailwind-variants";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  useRef,
  MouseEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
} from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType } from "../../types";

/**
 * List of acceptable key presses
 * to fire the `onDismiss` event
 */
const deleteKeys = ["Backspace", "Delete", "Space", "Enter"];

const isDeleteEvent = (event: KeyboardEvent<HTMLSpanElement>): boolean => {
  return deleteKeys.includes(event.code);
};

const chip = tv({
  slots: {
    base: "inline-flex items-center gap-x-1 rounded-full border px-3 py-0.5 text-xs font-bold",
    icon: "size-3",
  },
  variants: {
    color: {
      primary:
        "border-primary-700 bg-primary-100 text-primary-700 dark:border-primary-100 dark:bg-primary-700 dark:text-primary-100",
      secondary:
        "border-secondary-700 bg-secondary-100 text-secondary-700 dark:border-secondary-100 dark:bg-secondary-700 dark:text-secondary-100",
      success:
        "border-success-700 bg-success-100 text-success-700 dark:border-success-100 dark:bg-success-700 dark:text-success-100",
      warning:
        "border-warning-700 bg-warning-100 text-warning-700 dark:border-warning-100 dark:bg-warning-700 dark:text-warning-100",
      error:
        "border-error-700 bg-error-100 text-error-700 dark:border-error-100 dark:bg-error-700 dark:text-error-100",
    },
    dismissable: {
      true: "cursor-pointer outline-offset-2 outline-black focus-visible:border-black focus-visible:bg-focus focus-visible:text-black focus-visible:outline",
    },
  },
  compoundVariants: [
    {
      dismissable: true,
      color: "primary",
      class: {
        base: "hover:bg-primary-200 dark:hover:bg-primary-600",
      },
    },
    {
      dismissable: true,
      color: "secondary",
      class: {
        base: "hover:bg-secondary-200 dark:hover:bg-secondary-600",
      },
    },
    {
      dismissable: true,
      color: "success",
      class: {
        base: "hover:bg-success-200 dark:hover:bg-success-600",
      },
    },
    {
      dismissable: true,
      color: "warning",
      class: {
        base: "hover:bg-warning-200 dark:hover:bg-warning-600",
      },
    },
    {
      dismissable: true,
      color: "error",
      class: {
        base: "hover:bg-error-200 dark:hover:bg-error-600",
      },
    },
  ],
});

export type ChipVariants = VariantProps<typeof chip>;

export interface ChipProps
  extends ChipVariants,
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
      "color"
    > {
  onDismiss?: () => void;
  icon?: IconType;
}

const Chip = ({
  color = "primary",
  onDismiss,
  icon,
  children,
  className,
  ...rest
}: ChipProps) => {
  const intl = useIntl();
  const Icon = icon;
  const dismissable = !!onDismiss;
  const chipRef = useRef<HTMLSpanElement | null>(null);

  const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    event.stopPropagation();
    onDismiss?.();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    // Don't do anything, we want this event to fire on key up
    if (event.currentTarget === event.target && isDeleteEvent(event)) {
      event.preventDefault();
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    // Only handle key events on the chip, not children
    if (event.currentTarget === event.target) {
      if (onDismiss && isDeleteEvent(event)) {
        onDismiss();
      } else if (event.key === "Escape" && chipRef.current) {
        chipRef.current.blur();
      }
    }
  };

  const { base, icon: iconStyles } = chip();

  return (
    <span
      ref={chipRef}
      {...(onDismiss && {
        role: "button",
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
      })}
      className={base({
        color,
        dismissable,
        class: className,
      })}
      {...rest}
    >
      {onDismiss && (
        <XCircleIcon
          aria-label={intl.formatMessage(uiMessages.removeChip)}
          aria-hidden="false"
          // DOM order is first for readability "Remove X"
          // Move to end in visual order for design
          className={iconStyles({ class: "order-3" })}
        />
      )}
      {Icon && <Icon className={iconStyles()} />}
      <span>{children}</span>
    </span>
  );
};

export default Chip;
