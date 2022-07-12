import React from "react";
import { useIntl } from "react-intl";
import { CheckIcon, MinusIcon } from "@heroicons/react/outline";

import "./check-button.css";

const borderMap = {
  black: {
    "data-h2-border": "b(black, all, solid, s)",
  },
  white: {
    "data-h2-border": "b(lightgray, all, solid, s)",
  },
};

const colorMap = {
  black: {
    "data-h2-font-color": "b(black)",
  },
  white: {
    "data-h2-font-color": "b(lightgray)",
  },
};

export interface CheckButtonProps {
  checked: boolean;
  label: string;
  indeterminate?: boolean;
  onToggle: () => void;
  color?: "white" | "black";
}

const CheckButton = ({
  checked,
  label,
  onToggle,
  indeterminate = false,
  color = "black",
}: CheckButtonProps) => {
  const intl = useIntl();
  const handleClick = () => {
    onToggle();
  };

  let Icon: string | React.FC<{ className: string }> = "span";
  if (indeterminate) {
    Icon = MinusIcon;
  }
  if (checked) {
    Icon = CheckIcon;
  }

  return (
    <button
      className="check-button"
      type="button"
      onClick={handleClick}
      data-h2-bg-color="b(lightpurple[0]) b:h(lightpurple[.05])"
      data-h2-padding="b(all, xs)"
      data-h2-radius="b(s)"
      data-h2-display="b(inline-flex)"
      {...colorMap[color]}
    >
      <span data-h2-visibility="b(invisible)">
        {checked
          ? intl.formatMessage(
              {
                defaultMessage: "Deselect {label}",
                description: "Text to uncheck checkbox button",
              },
              { label },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Select {label}",
                description: "Text to check checkbox button",
              },
              { label },
            )}
      </span>
      <span
        className="check-button__inner"
        data-h2-padding="b(all, xxs)"
        {...borderMap[color]}
      >
        <Icon className="check-button__icon" data-h2-display="b(block)" />
      </span>
    </button>
  );
};

export default CheckButton;
