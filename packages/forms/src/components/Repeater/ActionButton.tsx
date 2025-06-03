import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "@gc-digital-talent/ui";

const DisabledIcon = () => (
  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  <span data-h2-color="base(gray)" aria-hidden data-h2-width="base(x.75)">
    &bull;
  </span>
);

const actionBtn = tv({
  slots: {
    base: "group flex cursor-pointer items-center rounded-full bg-transparent p-3 text-black dark:text-white",
    icon: "size-4.5",
  },
  variants: {
    disabled: {
      true: {
        base: "text-gray-500 dark:text-gray-300",
      },
      false: {
        base: "hover:bg-gray-100 focus-visible:bg-black dark:hover:bg-gray-700",
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
      <button ref={ref} type="button" className={base()} {...rest}>
        <Icon className={iconStyles()} />
      </button>
    );
  },
);

export default ActionButton;
