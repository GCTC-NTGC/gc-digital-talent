import React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import type { Color } from "../Button";

import "./toggle-group.css";

export const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(dt-primary)",
    "data-h2-color": "base:children[*](white)",
  },
  secondary: {
    "data-h2-background-color": "base(dt-secondary)",
    "data-h2-color": "base:children[*](white)",
  },
  cta: {
    "data-h2-background-color": "base(dt-accent)",
    "data-h2-color": "base:children[*](dt-black)",
  },
  white: {
    "data-h2-background-color": "base(white)",
    "data-h2-color": "base:children[*](dt-black)",
  },
  black: {
    "data-h2-background-color": "base(dt-black)",
    "data-h2-color": "base:children[*](white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-primary)",
    "data-h2-color": "base:children[*](white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary)",
    "data-h2-color": "base:children[*](white)",
  },
  yellow: {
    "data-h2-background-color": "base(tm-yellow)",
    "data-h2-color": "base:children[*](black)",
  },
  red: {
    "data-h2-background-color": "base(tm-red)",
    "data-h2-color": "base:children[*](black)",
  },
  blue: {
    "data-h2-background-color": "base(tm-blue)",
    "data-h2-color": "base:children[*](black)",
  },
};

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>((props, forwardedRef) => (
  <ToggleGroupPrimitive.Item
    className="ToggleGroup__Item"
    data-h2-display="base(block)"
    data-h2-padding="base(x.25, x.5)"
    data-h2-radius="base(m)"
    data-h2-background-color="base:hover(white.15)"
    data-h2-cursor="base:hover(pointer)"
    ref={forwardedRef}
    {...props}
  />
));

type ToggleGroupType = typeof ToggleGroupPrimitive.Root;
export interface ToggleGroupProps extends ToggleGroupType {
  color?: Color;
}

const ToggleGroup = React.forwardRef<
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
      data-h2-gap="base(x.25, 0)"
      ref={forwardedRef}
      {...rest}
    />
  );
});

const Item = ToggleGroupItem;
const Root = ToggleGroup;

export { Item, Root };
