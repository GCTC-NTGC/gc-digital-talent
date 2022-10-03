import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import "./tabs.css";

const Root = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>((props, forwardedRef) => (
  <TabsPrimitive.Root ref={forwardedRef} {...props} />
));

const List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>((props, forwardedRef) => (
  <TabsPrimitive.List ref={forwardedRef} {...props} />
));

const Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>((props, forwardedRef) => (
  <TabsPrimitive.Trigger
    className="Tabs__Trigger"
    data-h2-background-color="base(dt-white)"
    data-h2-border="base(all, 1px, solid, dt-gray) base(top, x.5, solid, dt-gray) base:hover(top, x.5, solid, dark.dt-gray)"
    data-h2-cursor="base(pointer)"
    data-h2-padding="base(x.5, x1)"
    data-h2-margin="base(0, x.5, 0, 0)"
    data-h2-position="base(relative)"
    data-h2-offset="base(1px, auto, auto, auto)"
    data-h2-radius="base(s, s, 0, 0)"
    data-h2-transition="base(border, 100ms, ease)"
    ref={forwardedRef}
    {...props}
  />
));

const Content = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, forwardedRef) => (
  <TabsPrimitive.Content
    data-h2-background-color="base(dt-white)"
    data-h2-border="base(all, 1px, solid, dt-gray)"
    data-h2-radius="base(0, s, s, s)"
    data-h2-padding="base(x1, x.75)"
    ref={forwardedRef}
    {...props}
  />
));

export { Root, List, Trigger, Content };
