import React from "react";
import { useIntl } from "react-intl";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";

import "./check-button.css";

const borderMap = {
  black: {
    "data-h2-border": "base(1px solid dt-black)",
  },
  white: {
    "data-h2-border": "base(1px solid dt-gray.light)",
  },
};

const colorMap = {
  black: {
    "data-h2-color": "base(dt-black)",
    "data-h2-background-color":
      "base(transparent) base:hover(dt-primary.light.25)",
  },
  white: {
    "data-h2-color": "base(dt-gray.light)",
    "data-h2-background-color": "base(transparent) base:hover(dt-white.25)",
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
      data-h2-padding="base(x.25)"
      data-h2-radius="base(s)"
      data-h2-display="base(inline-flex)"
      {...colorMap[color]}
    >
      <span data-h2-visually-hidden="base(invisible)">
        {checked
          ? intl.formatMessage(
              {
                defaultMessage: "Deselect {label}",
                id: "+6TuVe",
                description: "Text to uncheck checkbox button",
              },
              { label },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Select {label}",
                id: "/SBJ7g",
                description: "Text to check checkbox button",
              },
              { label },
            )}
      </span>
      <span
        className="check-button__inner"
        data-h2-padding="base(x.125)"
        {...borderMap[color]}
      >
        <Icon className="check-button__icon" data-h2-display="base(block)" />
      </span>
    </button>
  );
};

export default CheckButton;
