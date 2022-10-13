/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/scroll-area
 */
import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import "./scroll-area.css";

const Root = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>((props, forwardedRef) => (
  <ScrollAreaPrimitive.Root
    data-h2-overflow="base(hidden)"
    data-h2-radius="base(rounded)"
    data-h2-shadow="base(s)"
    ref={forwardedRef}
    {...props}
  />
));

const Viewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>((props, forwardedRef) => (
  <ScrollAreaPrimitive.Viewport
    data-h2-height="base(100%)"
    data-h2-radius="base(rounded)"
    data-h2-width="base(100%)"
    ref={forwardedRef}
    {...props}
  />
));

const Scrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>((props, forwardedRef) => (
  <ScrollAreaPrimitive.Scrollbar
    className="ScrollArea__Scrollbar"
    data-h2-background-color="base(lighter.dt-gray) base:hover(light.dt-gray)"
    data-h2-display="base(flex)"
    data-h2-padding="base(x.1)"
    data-h2-transition="base(background, 100ms, ease-out)"
    style={{
      touchAction: "none",
      userSelect: "none",
    }}
    ref={forwardedRef}
    {...props}
  />
));

const Thumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>((props, forwardedRef) => (
  <ScrollAreaPrimitive.Thumb
    className="ScrollArea__Thumb"
    data-h2-background-color="base(dt-primary)"
    data-h2-radius="base(s)"
    data-h2-position="base(relative)"
    style={{ flex: 1 }}
    ref={forwardedRef}
    {...props}
  />
));

const Corner = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
>((props, forwardedRef) => (
  <ScrollAreaPrimitive.Corner
    data-h2-background-color="base(dt-primary)"
    ref={forwardedRef}
    {...props}
  />
));

/**
 * @name Scroll Area
 * @desc Augments native scroll functionality for custom, cross-browser styling.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area)
 */
const ScrollArea = {
  /**
   * @name Root
   * @desc Contains all the parts of a scroll area.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area#root)
   */
  Root,
  /**
   * @name Viewport
   * @desc The viewport area of the scroll area.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area#viewport)
   */
  Viewport,
  /**
   * @name Scrollbar
   * @desc The vertical scrollbar. Add a second Scrollbar with an orientation prop to enable horizontal scrolling.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area#scrollbar)
   */
  Scrollbar,
  /**
   * @name Thumb
   * @desc The thumb to be used in ScrollArea.Scrollbar.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area#thumb)
   */
  Thumb,
  /**
   * @name Corner
   * @desc The corner where both vertical and horizontal scrollbars meet.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area#corner)
   */
  Corner,
};

export default ScrollArea;
