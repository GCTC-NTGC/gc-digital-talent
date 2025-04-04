import * as SeparatorPrimitive from "@radix-ui/react-separator";
import {
  ComponentPropsWithoutRef,
  DetailedHTMLProps,
  ElementRef,
  HTMLAttributes,
  forwardRef,
} from "react";

type SeparatorProps = ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> & {
  space?: "none" | "xs" | "sm" | "md" | "lg";
} & Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>,
    "ref"
  >;

/**
 * @name Separator
 * @desc Visually or semantically separates content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/separator)
 */
const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { space = "md", orientation = "horizontal", decorative = true, ...rest },
    forwardedRef,
  ) => {
    let spaceStyles: Record<string, string> = {};
    if (space !== "none") {
      if (space === "xs") {
        spaceStyles =
          orientation === "vertical"
            ? { "data-h2-margin": "base(0 x.5)" }
            : { "data-h2-margin": "base(x.5 0)" };
      }

      if (space === "sm") {
        spaceStyles =
          orientation === "vertical"
            ? { "data-h2-margin": "base(0 x1)" }
            : { "data-h2-margin": "base(x1 0)" };
      }
      if (space === "md") {
        spaceStyles =
          orientation === "vertical"
            ? { "data-h2-margin": "base(0 x2)" }
            : { "data-h2-margin": "base(x2 0)" };
      }
      if (space === "lg") {
        spaceStyles =
          orientation === "vertical"
            ? { "data-h2-margin": "base(x3 0)" }
            : { "data-h2-margin": "base(x3 0)" };
      }
    }
    return (
      <SeparatorPrimitive.Root
        ref={forwardedRef}
        {...{ orientation, decorative }}
        data-h2-height="
      base:selectors[[data-orientation='vertical']](100%)
      base:selectors[[data-orientation='horizontal']](1px)"
        data-h2-width="
      base:selectors[[data-orientation='vertical']](1px)
      base:selectors[[data-orientation='horizontal']](100%)"
        data-h2-background-color="base(gray)"
        {...spaceStyles}
        {...rest}
      />
    );
  },
);

export default Separator;
