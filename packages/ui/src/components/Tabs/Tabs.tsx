/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/tabs
 */
import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const Root = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>((props, forwardedRef) => (
  <TabsPrimitive.Root
    ref={forwardedRef}
    data-h2-max-width="base(100%)"
    {...props}
  />
));

const List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ children, ...rest }, forwardedRef) => (
  <TabsPrimitive.List
    data-h2-max-width="base(100%)"
    data-h2-display="base(flex)"
    data-h2-gap="base(x.25)"
    data-h2-overflow="base(auto visible)"
    data-h2-width="base(100%)"
    data-h2-padding="base(0 x1)"
    data-h2-z-index="base(1)"
    data-h2-overflow-x="base(auto)"
    data-h2-overscroll-behavior-x="base(contain)"
    data-h2-scroll-snap-align="base(start)"
    data-h2-scroll-snap-type="base(x mandatory)"
    data-h2-scrollbar-width="base:hover(none)"
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </TabsPrimitive.List>
));

const Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ children, ...rest }, forwardedRef) => {
  const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (event) => {
    event.currentTarget.scrollIntoView({
      block: "center",
    });
  };

  return (
    <TabsPrimitive.Trigger
      className="Tabs__Trigger"
      onFocus={handleFocus}
      data-h2-background-color="base(background)"
      data-h2-border="base(thin solid background.darker)"
      data-h2-border-top-color="
      base:selectors[[data-state='active'] > span](primary)
      base:focus-visible:children[span](focus)
    "
      data-h2-border-bottom-color="base:selectors[[data-state='active']](transparent)"
      data-h2-color="
      base(black)
      base:selectors[[data-state='active']](primary.darker)
    "
      data-h2-display="base(inline-flex)"
      data-h2-font-weight="base:selectors[[data-state='active']](700)"
      data-h2-margin-top="base(x.25) base:hover(0)"
      data-h2-padding="base(0)"
      data-h2-outline="base(none)"
      data-h2-radius="base(rounded rounded 0 0)"
      data-h2-text-decoration="base:selectors[[data-state='inactive']](underline)"
      data-h2-position="base(relative)"
      data-h2-z-index="base(1)"
      ref={forwardedRef}
      {...rest}
    >
      <span
        data-h2-border-top="base(x.25 solid background.darker)"
        data-h2-display="base(block)"
        data-h2-radius="base(s s 0 0)"
        data-h2-padding="base(x.5 x.75)"
      >
        {children}
      </span>
    </TabsPrimitive.Trigger>
  );
});

const Content = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, forwardedRef) => (
  <TabsPrimitive.Content
    ref={forwardedRef}
    data-h2-border-top="base(thin solid background.darker)"
    data-h2-color="base(black)"
    data-h2-margin-top="base(-1px)"
    data-h2-max-width="base(100%)"
    data-h2-outline="base(none)"
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
