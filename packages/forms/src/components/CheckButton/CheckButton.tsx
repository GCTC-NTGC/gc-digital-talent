import React from "react";
import { useIntl } from "react-intl";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";

import { formMessages } from "@gc-digital-talent/i18n";

import "./check-button.css";

const borderMap = {
  black: {
    "data-h2-border": "base(1px solid black)",
  },
  white: {
    "data-h2-border": "base(1px solid gray.light)",
  },
};

const colorMap = {
  black: {
    "data-h2-color": "base(black)",
    "data-h2-background-color":
      "base(transparent) base:hover(primary.light.25)",
  },
  white: {
    "data-h2-color": "base(gray.light)",
    "data-h2-background-color": "base(transparent) base:hover(white.25)",
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

  let Icon:
    | string
    | React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>> = "span";
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
          ? intl.formatMessage(formMessages.deselectCheck, { label })
          : intl.formatMessage(formMessages.selectCheck, { label })}
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
