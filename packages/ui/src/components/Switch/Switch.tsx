import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import getStyles, { SwitchColor } from "./styles";
import { IconType } from "../../types";
import useControllableState from "../../hooks/useControllableState";

export type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> & {
  disabled?: boolean;
  // Display an icon in the handle for the switch
  icon?: {
    // Default icon displayed in the handle
    default: IconType;
    // Overrides the default icon when the switch is checked
    checked?: IconType;
  };
  // Changes the background color when the switch is checked
  color?: SwitchColor;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
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
    const styles = getStyles(color, disabled);
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
        {...styles}
        ref={forwardedRef}
        checked={checked}
        onCheckedChange={toggle}
        {...(disabled && {
          "aria-disabled": "true",
        })}
        data-h2-transition="base(background-color, 100ms, ease-in-out)"
        data-h2-outline="base(none)"
        data-h2-padding="base(x.1)"
        data-h2-position="base(relative)"
        data-h2-radius="base(9999px)"
        data-h2-width="base(x2.2)"
        {...rest}
      >
        <SwitchPrimitive.Thumb
          data-h2-background-color="base(white)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-height="base(x1)"
          data-h2-justify-content="base(center)"
          data-h2-radius="base(9999px)"
          data-h2-shadow="base(s)"
          data-h2-transition="base(transform 100ms ease-in-out)"
          data-h2-transform="
        base(translateX(0))
        base:selectors[[data-state='checked']](translateX(x1))"
          data-h2-width="base(x1)"
        >
          {Icon && (
            <Icon
              data-h2-height="base(x.75)"
              data-h2-width="base(x.75)"
              {...(disabled
                ? {
                    "data-h2-color":
                      "base(gray) base:selectors[[data-state='checked']](gray.darker)",
                  }
                : {
                    "data-h2-color": "base(black)",
                  })}
            />
          )}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );
  },
);

export default Switch;
