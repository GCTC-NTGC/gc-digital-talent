/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/tabs
 */
import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

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
    data-h2-border="base(1px solid dt-gray)"
    data-h2-border-top="
      base(x.5 solid dt-gray)
      base:selectors[[data-state='active']](x.5 solid dt-primary)
      base:hover(x.5 solid dt-gray.dark)"
    data-h2-border-bottom="base:selectors[[data-state='active']](1px solid dt-white)"
    data-h2-cursor="base(pointer)"
    data-h2-padding="base(x.5, x1)"
    data-h2-margin="base(0, x.5, 0, 0)"
    data-h2-position="base(relative)"
    data-h2-location="base(1px, auto, auto, auto)"
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
    data-h2-border="base(1px solid dt-gray)"
    data-h2-radius="base(0, s, s, s)"
    data-h2-padding="base(x1, x.75)"
    ref={forwardedRef}
    {...props}
  />
));

/**
 * @name Tabs
 * @desc A set of layered sections of content—known as tab panels—that are displayed one at a time.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs)
 */
const Tabs = {
  /**
   * @name Root
   * @desc An item in the group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group#item)
   */
  Root,
  /**
   * @name List
   * @desc Contains the triggers that are aligned along the edge of the active content.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs#list)
   */
  List,
  /**
   * @name Trigger
   * @desc The button that activates its associated content.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs#trigger)
   */
  Trigger,
  /**
   * @name Content
   * @desc Contains the content associated with each trigger.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs#content)
   */
  Content,
};

export default Tabs;
