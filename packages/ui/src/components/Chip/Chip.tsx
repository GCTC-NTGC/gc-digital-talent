import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { useIntl } from "react-intl";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  useRef,
  MouseEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
} from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import { Color, IconType } from "../../types";
import colorMap from "./styles";

/**
 * List of acceptable key presses
 * to fire the `onDismiss` event
 */
const deleteKeys = ["Backspace", "Delete", "Space", "Enter"];

const isDeleteEvent = (event: KeyboardEvent<HTMLSpanElement>): boolean => {
  return deleteKeys.includes(event.code);
};

export type ChipProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  color?: Color;
  icon?: IconType;
  onDismiss?: () => void;
};

const Chip = ({
  color = "primary",
  onDismiss,
  icon,
  children,
  ...rest
}: ChipProps) => {
  const intl = useIntl();
  const Icon = icon;
  const chipRef = useRef<HTMLSpanElement | null>(null);
  const styles = colorMap.get(color);

  const iconProps = {
    "data-h2-width": "base(x.5)",
    "data-h2-height": "base(x.5)",
  };

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

  return (
    <span
      ref={chipRef}
      data-h2-align-items="base(center)"
      data-h2-gap="base(x.25)"
      data-h2-display="base(inline-flex)"
      data-h2-font-size="base(caption)"
      data-h2-font-weight="base(700)"
      data-h2-padding="base(x.05 x.5)"
      data-h2-radius="base(m)"
      {...(onDismiss && {
        className: "Chip Chip--dismissible",
        role: "button",
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        "data-h2-cursor": "base(pointer)",
        "data-h2-outline": "base(none)",
      })}
      {...styles}
      {...rest}
    >
      {onDismiss && (
        <XCircleIcon
          aria-label={intl.formatMessage(uiMessages.removeChip)}
          aria-hidden="false"
          // DOM order is first for readability "Remove X"
          // Move to end in visual order for design
          data-h2-order="base(3)"
          {...iconProps}
        />
      )}
      {Icon && <Icon {...iconProps} />}
      <span>{children}</span>
    </span>
  );
};

export default Chip;
