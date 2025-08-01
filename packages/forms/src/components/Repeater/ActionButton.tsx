import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { HTMLEntity, IconType } from "@gc-digital-talent/ui";

const DisabledIcon = () => (
  <HTMLEntity name="&bull;" className="w-4.5 text-gray/50 dark:text-gray/50" />
);

const actionBtn = tv({
  slots: {
    base: "group flex cursor-pointer items-center rounded-full bg-transparent p-3 text-black outline-none dark:text-white",
    icon: "size-4.5",
  },
  variants: {
    disabled: {
      true: {
        base: "cursor-default text-gray-500 dark:text-gray-200",
      },
      false: {
        base: "hover:bg-gray-100 focus-visible:bg-focus focus-visible:text-black dark:hover:bg-gray-700",
      },
    },
    animation: {
      up: {
        icon: "translate-y-0 group-hover:-translate-y-1/5 focus-visible:-translate-y-1/5",
      },
      down: {
        icon: "translate-y-0 group-hover:translate-y-1/5 focus-visible:translate-y-1/5",
      },
    },
  },
  compoundVariants: [
    {
      disabled: false,
      animation: ["up", "down"],
      class: {
        icon: "transform transition-transform duration-200 ease-linear",
      },
    },
  ],
});

type ActionButtonVariants = VariantProps<typeof actionBtn>;

interface ActionButtonProps
  extends ActionButtonVariants,
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  icon: IconType;
}

/**
 * Generic button to apply styles to a
 * fieldset action button
 */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ animation, disabled, icon, ...rest }, ref) => {
    const Icon = disabled ? DisabledIcon : icon;
    const { base, icon: iconStyles } = actionBtn({ animation, disabled });

    return (
      <button
        ref={ref}
        type="button"
        className={base()}
        disabled={disabled}
        {...rest}
      >
        <Icon className={iconStyles()} />
      </button>
    );
  },
);

export default ActionButton;
