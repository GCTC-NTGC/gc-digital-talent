import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import { tv, VariantProps } from "tailwind-variants";

import { formMessages } from "@gc-digital-talent/i18n";
import { IconType } from "@gc-digital-talent/ui";

const checkBtn = tv({
  slots: {
    btn: "inline-flex cursor-pointer rounded border-none bg-transparent p-1.5",
    icon: "rounded border bg-white p-0.5 dark:bg-gray-600",
  },
  variants: {
    color: {
      black: {
        btn: "text-black hover:bg-black/25 dark:text-white dark:hover:bg-white/25",
        icon: "border-black dark:border-white",
      },

      white: {
        btn: "text-gray-600 hover:bg-white/25 dark:text-gray-200 dark:hover:bg-gray-700/25",
        icon: "border-gray-100 dark:border-gray-700",
      },
    },
  },
});

type CheckButtonVariants = VariantProps<typeof checkBtn>;

export interface CheckButtonProps extends CheckButtonVariants {
  checked: boolean;
  label: string;
  indeterminate?: boolean;
  onToggle: () => void;
}

const CheckButton = ({
  checked,
  label,
  onToggle,
  indeterminate = false,
  color = "black",
}: CheckButtonProps) => {
  const intl = useIntl();
  const { btn, icon: iconStyles } = checkBtn({ color });

  // NOTE: Not redundant
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  let Icon: string | IconType = "span";
  if (indeterminate) {
    Icon = MinusIcon;
  }
  if (checked) {
    Icon = CheckIcon;
  }

  return (
    <button type="button" onClick={onToggle} className={btn()}>
      <span className="sr-only">
        {checked
          ? intl.formatMessage(formMessages.deselectCheck, { label })
          : intl.formatMessage(formMessages.selectCheck, { label })}
      </span>
      <span className={iconStyles()}>
        <Icon className="block size-3 stroke-3" />
      </span>
    </button>
  );
};

export default CheckButton;
