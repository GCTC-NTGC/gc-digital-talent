/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/toggle-group
 */
import React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

export type Color =
  | "primary"
  | "primary.dark"
  | "secondary"
  | "cta"
  | "white"
  | "black"
  | "ia-primary"
  | "ia-secondary"
  | "yellow"
  | "red"
  | "blue";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(dt-primary)",
    "data-h2-color":
      "base:children[>*](white) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  "primary.dark": {
    "data-h2-background-color": "base(dt-primary.dark)",
    "data-h2-color":
      "base:children[>*](white) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(dt-secondary) base:dark(dt-secondary.lighter)",
    "data-h2-color":
      "base:children[>*](white) base:dark:children[>*](black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  cta: {
    "data-h2-background-color": "base(dt-accent)",
    "data-h2-color":
      "base:children[>*](dt-black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  white: {
    "data-h2-background-color": "base(white) base:dark(black.lighter)",
    "data-h2-color":
      "base:children[>*](dt-black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  black: {
    "data-h2-background-color": "base(dt-black) base:dark(dt-black.lighter)",
    "data-h2-color":
      "base:children[>*](white) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-primary)",
    "data-h2-color":
      "base:children[>*](white) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary)",
    "data-h2-color":
      "base:children[>*](white) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  yellow: {
    "data-h2-background-color": "base(tm-yellow)",
    "data-h2-color":
      "base:children[>*](black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  red: {
    "data-h2-background-color": "base(tm-red)",
    "data-h2-color":
      "base:children[>*](black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
  blue: {
    "data-h2-background-color": "base(tm-blue)",
    "data-h2-color":
      "base:children[>*](black) base:children[>[data-state='on']](black) base:dark:children[>[data-state='on']](white)",
  },
};

const Item = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>((props, forwardedRef) => (
  <ToggleGroupPrimitive.Item
    data-h2-align-items="base(center)"
    data-h2-background-color="
      base(transparent)
      base:selectors[[data-state='on']](white)
      base:dark:selectors[[data-state='on']](black)
      base:hover(white.15)
      base:dark:hover(black.15)
      base:focus-visible(focus)
      base:dark:selectors[[data-state='on']]:focus-visible(focus)"
    data-h2-cursor="base:hover(pointer)"
    data-h2-display="base(flex)"
    data-h2-line-height="base(1)"
    data-h2-outline="base(none)"
    data-h2-padding="base(x.25, x.5)"
    data-h2-radius="base(m)"
    data-h2-text-decoration="base:selectors[[data-state='off']](underline)"
    data-h2-width="base:children[svg](var(--h2-font-size-copy))"
    ref={forwardedRef}
    {...props}
  />
));

type ToggleGroupType = typeof ToggleGroupPrimitive.Root;
export interface ToggleGroupProps extends ToggleGroupType {
  color?: Color;
}

const Root = React.forwardRef<
  React.ElementRef<ToggleGroupType>,
  React.ComponentPropsWithoutRef<ToggleGroupProps>
>(({ color = "primary", ...rest }, forwardedRef) => {
  return (
    <ToggleGroupPrimitive.Root
      className={`ToggleGroup ToggleGroup--${color}`}
      {...colorMap[color as Color]}
      data-h2-display="base(inline-flex)"
      data-h2-padding="base(x.25)"
      data-h2-radius="base(m)"
      data-h2-gap="base(0, x.25)"
      ref={forwardedRef}
      {...rest}
    />
  );
});

/**
 * @name Toggle Group
 * @desc A set of two-state buttons that can be toggled on or off.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group)
 */
const ToggleGroup = {
  /**
   * @name Root
   * @desc Contains all the parts of a toggle group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group#root)
   */
  Root,
  /**
   * @name Item
   * @desc An item in the group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group#item)
   */
  Item,
};

export default ToggleGroup;
