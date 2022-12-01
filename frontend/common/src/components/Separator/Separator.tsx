import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

/**
 * @name Separator
 * @desc Visually or semantically separates content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/separator)
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>((props, forwardedRef) => (
  <SeparatorPrimitive.Root
    data-h2-height="
      base:selectors[[data-orientation='vertical']](100%)
      base:selectors[[data-orientation='horizontal']](1px)"
    data-h2-width="
      base:selectors[[data-orientation='vertical']](1px)
      base:selectors[[data-orientation='horizontal']](100%)"
    ref={forwardedRef}
    {...props}
  />
));

export default Separator;
