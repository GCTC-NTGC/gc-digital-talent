import * as SwitchPrimitive from "@radix-ui/react-switch";
import { tv, VariantProps } from "tailwind-variants";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { IconType } from "../../types";
import useControllableState from "../../hooks/useControllableState";

const switchStyles = tv({
  slots: {
    base: "group/switch relative w-13 rounded-full bg-gray-100 p-0.5 transition-colors duration-100 ease-in-out outline-none focus-visible:bg-focus data-[state=checked]:focus-visible:bg-focus dark:bg-gray-600",
    thumb:
      "flex h-6 w-6 translate-x-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-100 ease-in-out data-[state=checked]:translate-x-6 dark:bg-gray-700",
    icon: "size-4.5",
  },
  variants: {
    disabled: {
      true: {
        icon: "dark:group-data[state=checked]/switch:text-gray-500 text-gray",
      },
      false: {
        icon: "text-black dark:text-white",
      },
    },
    color: {
      primary: {
        base: "data-[state=checked]:bg-primary-300 dark:bg-gray-400 dark:data-[state=checked]:bg-primary-500",
      },
      secondary: {
        base: "data-[state=checked]:bg-secondary-300 dark:bg-gray-400 dark:data-[state=checked]:bg-secondary-500",
      },
      success: {
        base: "data-[state=checked]:bg-success-300 dark:bg-gray-400 dark:data-[state=checked]:bg-success-500",
      },
      warning: {
        base: "data-[state=checked]:bg-warning-300 dark:bg-gray-400 dark:data-[state=checked]:bg-warning-500",
      },
      error: {
        base: "data-[state=checked]:bg-error-300 dark:bg-gray-400 dark:data-[state=checked]:bg-error-500",
      },
    },
  },
  compoundVariants: [
    {
      disabled: true,
      color: ["primary", "secondary", "success", "warning", "error"],
      class: {
        base: "bg-gray-200 data-[state=checked]:bg-gray-300 dark:bg-gray-500 dark:data-[state=checked]:bg-gray",
      },
    },
  ],
});

type SwitchVariants = VariantProps<typeof switchStyles>;

export interface SwitchProps
  extends SwitchVariants,
    Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "color"> {
  // Display an icon in the handle for the switch
  icon?: {
    // Default icon displayed in the handle
    default: IconType;
    // Overrides the default icon when the switch is checked
    checked?: IconType;
  };
}

const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      color = "primary",
      icon,
      disabled,
      checked: checkedProp,
      onCheckedChange,
      defaultChecked = false,
      ...rest
    },
    forwardedRef,
  ) => {
    const [checked = false, setChecked] = useControllableState<boolean>({
      controlledProp: checkedProp,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });
    const { base, icon: iconStyles, thumb } = switchStyles({ color, disabled });
    let Icon: IconType | null = null;
    if (icon) {
      Icon = checked && icon.checked ? icon.checked : icon.default;
    }

    const toggle = (newChecked: boolean) => {
      if (!disabled) {
        setChecked(newChecked);
      }
    };

    return (
      <SwitchPrimitive.Root
        ref={forwardedRef}
        checked={checked}
        onCheckedChange={toggle}
        {...(disabled && {
          "aria-disabled": "true",
        })}
        className={base()}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={thumb()}>
          {Icon && <Icon className={iconStyles()} />}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );
  },
);

export default Switch;
