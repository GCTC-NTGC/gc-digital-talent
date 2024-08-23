import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";

import { formMessages } from "@gc-digital-talent/i18n";
import { IconType } from "@gc-digital-talent/ui";

const borderMap = {
  black: {
    "data-h2-border": "base(1px solid black)",
  },
  white: {
    "data-h2-border": "base(1px solid gray.light) base:dark(black)",
  },
};

const colorMap = {
  black: {
    "data-h2-color": "base(black)",
    "data-h2-background-color": "base(transparent) base:hover(black.3)",
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

  // NOTE: These are not redundant
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  let Icon: IconType | string = "span";
  if (indeterminate) {
    Icon = MinusIcon;
  }
  if (checked) {
    Icon = CheckIcon;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-h2-padding="base(x.25)"
      data-h2-radius="base(s)"
      data-h2-display="base(inline-flex)"
      data-h2-border="base(none)"
      data-h2-cursor="base(pointer)"
      {...colorMap[color]}
    >
      <span data-h2-visually-hidden="base(invisible)">
        {checked
          ? intl.formatMessage(formMessages.deselectCheck, { label })
          : intl.formatMessage(formMessages.selectCheck, { label })}
      </span>
      <span
        data-h2-padding="base(x.125)"
        data-h2-radius="base(input)"
        data-h2-background-color="base(foreground)"
        {...borderMap[color]}
      >
        <Icon
          data-h2-display="base(block)"
          data-h2-stroke-width="base(3)"
          data-h2-height="base(x.5)"
          data-h2-width="base(x.5)"
        />
      </span>
    </button>
  );
};

export default CheckButton;
