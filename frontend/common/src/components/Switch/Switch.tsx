/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/switch
 */
import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

const Root = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>((props, forwardedRef) => (
  <SwitchPrimitive.Root
    data-h2-background-color="
      base(dt-gray)
      base:selectors[[data-state='checked']](dt-primary)"
    data-h2-transition="base(background-color, 100ms, ease-in-out)"
    data-h2-height="base(1rem)"
    data-h2-outline="base(none)"
    data-h2-position="base(relative)"
    data-h2-radius="base(9999px)"
    data-h2-width="base(2rem)"
    ref={forwardedRef}
    {...props}
  />
));

const Thumb = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>((props, forwardedRef) => (
  <SwitchPrimitive.Thumb
    data-h2-background-color="base(dt-white)"
    data-h2-display="base(block)"
    data-h2-height="base(1.2rem)"
    data-h2-location="base(50%, 0, 0, 0)"
    data-h2-position="base(absolute)"
    data-h2-radius="base(9999px)"
    data-h2-shadow="base(s)"
    data-h2-transition="base(transform, 100ms, ease-in-out)"
    data-h2-transform="
      base(translate(-0.1rem, -50%))
      base:selectors[[data-state='checked']](translate(calc(100% + 0.1rem), -50%))"
    data-h2-width="base(1.2rem)"
    ref={forwardedRef}
    {...props}
  />
));

/**
 * @name Switch
 * @desc A control that allows the user to toggle between checked and not checked.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/swtich)
 */
const Switch = {
  /**
   * @name Root
   * @desc Contains all the parts of a switch.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/switch#root)
   */
  Root,
  /**
   * @name Thumb
   * @desc The thumb that is used to visually indicate whether the switch is on or off.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/switch#thumb)
   */
  Thumb,
};

export default Switch;
