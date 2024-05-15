/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/tabs
 */
import { forwardRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { commonTabStyles, handleTabFocus } from "./utils";

const Root = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>((props, forwardedRef) => (
  <TabsPrimitive.Root ref={forwardedRef} {...commonTabStyles.root} {...props} />
));

const List = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ children, ...rest }, forwardedRef) => (
  <TabsPrimitive.List
    ref={forwardedRef}
    className="Tabs__List"
    {...commonTabStyles.list}
    {...rest}
  >
    {children}
  </TabsPrimitive.List>
));

const Trigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ children, ...rest }, forwardedRef) => (
  <TabsPrimitive.Trigger
    className="Tabs__Trigger"
    onFocus={handleTabFocus}
    {...commonTabStyles.trigger}
    ref={forwardedRef}
    {...rest}
  >
    <span {...commonTabStyles.triggerInner}>{children}</span>
  </TabsPrimitive.Trigger>
));

const Content = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, forwardedRef) => (
  <TabsPrimitive.Content
    ref={forwardedRef}
    {...commonTabStyles.contentDivide}
    data-h2-padding="base(x1)"
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
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs#root)
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
