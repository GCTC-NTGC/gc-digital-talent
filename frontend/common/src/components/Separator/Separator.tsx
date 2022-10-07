import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import "./separator.css";

import { Color } from "../Button";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(light.dt-primary)",
  },
  secondary: {
    "data-h2-background-color": "base(light.dt-secondary)",
  },
  cta: {
    "data-h2-background-color": "base(dt-accent)",
  },
  white: {
    "data-h2-background-color": "base(dt-white)",
  },
  black: {
    "data-h2-background-color": "base(light.dt-black)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(light.ia-primary)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(light.ia-secondary)",
  },
  yellow: {
    "data-h2-background-color": "base(tm-yellow)",
  },
  red: {
    "data-h2-background-color": "base(tm-red)",
  },
  blue: {
    "data-h2-background-color": "base(tm-blue)",
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
