import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import "./separator.css";

import { Color } from "../Button";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(dt-primary.5)",
  },
  secondary: {
    "data-h2-background-color": "base(dt-secondary.5)",
  },
  cta: {
    "data-h2-background-color": "base(dt-accent.5)",
  },
  white: {
    "data-h2-background-color": "base(dt-white.5)",
  },
  black: {
    "data-h2-background-color": "base(dt-gray.5)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-primary.5)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary.5)",
  },
  yellow: {
    "data-h2-background-color": "base(tm-yellow.5)",
  },
  red: {
    "data-h2-background-color": "base(tm-red.5)",
  },
  blue: {
    "data-h2-background-color": "base(tm-blue.5)",
  },
  purple: {
    "data-h2-background-color": "base(tm-purple.5)",
  },
};

type SeparatorPrimitiveRootProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
>;

export interface SeparatorProps extends SeparatorPrimitiveRootProps {
  color?: Color;
}

/**
 * @name Separator
 * @desc Visually or semantically separates content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/separator)
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ color = "primary", ...rest }, forwardedRef) => (
  <SeparatorPrimitive.Root
    className="Separator"
    {...colorMap[color]}
    ref={forwardedRef}
    {...rest}
  />
));

export default Separator;
