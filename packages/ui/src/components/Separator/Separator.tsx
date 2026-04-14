import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const separator = tv({
  base: "bg-gray-200 dark:bg-gray-700",
  variants: {
    space: {
      none: "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
    orientation: {
      vertical: "h-full w-px",
      horizontal: "h-px w-full",
    },
  },
  compoundVariants: [
    {
      space: "xs",
      orientation: "vertical",
      class: "mx-3",
    },
    {
      space: "xs",
      orientation: "horizontal",
      class: "my-3",
    },
    {
      space: "sm",
      orientation: "vertical",
      class: "mx-6",
    },
    {
      space: "sm",
      orientation: "horizontal",
      class: "my-6",
    },
    {
      space: "md",
      orientation: "vertical",
      class: "mx-12",
    },
    {
      space: "md",
      orientation: "horizontal",
      class: "my-12",
    },
    {
      space: "lg",
      orientation: "vertical",
      class: "mx-18",
    },
    {
      space: "lg",
      orientation: "horizontal",
      class: "my-18",
    },
  ],
});

type SeparatorVariants = VariantProps<typeof separator>;

export interface SeparatorProps
  extends
    SeparatorVariants,
    ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}

/**
 * @name Separator
 * @desc Visually or semantically separates content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/separator)
 */
const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      space = "md",
      orientation = "horizontal",
      decorative = true,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <SeparatorPrimitive.Root
        ref={forwardedRef}
        className={separator({ space, orientation, class: className })}
        {...{ orientation, decorative }}
        {...rest}
      />
    );
  },
);

export default Separator;
