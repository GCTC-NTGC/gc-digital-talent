import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import "./separator.css";

import { Color } from "../Button";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(dt-primary.50)",
  },
  secondary: {
    "data-h2-background-color": "base(dt-secondary.50)",
  },
  cta: {
    "data-h2-background-color": "base(dt-accent.50)",
  },
  white: {
    "data-h2-background-color": "base(dt-white.50)",
  },
  black: {
    "data-h2-background-color": "base(dt-gray.50)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-primary.50)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary.50)",
  },
  yellow: {
    "data-h2-background-color": "base(tm-yellow.50)",
  },
  red: {
    "data-h2-background-color": "base(tm-red.50)",
  },
  blue: {
    "data-h2-background-color": "base(tm-blue.50)",
  },
  purple: {
    "data-h2-background-color": "base(tm-purple.50)",
  },
};

type SeparatorPrimitiveRootProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
>;

export interface SeparatorProps extends SeparatorPrimitiveRootProps {
  color?: Color;
}

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
