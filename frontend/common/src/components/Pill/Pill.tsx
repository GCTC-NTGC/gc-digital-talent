import React from "react";

export type PillSize = "sm" | "md" | "lg";
export type PillColor =
  | "primary"
  | "secondary"
  | "neutral"
  | "blue"
  | "green"
  | "error";
export type PillMode = "solid" | "outline";

export interface PillProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "size"> {
  /** The style type of the element. */
  color: PillColor;
  /** The style mode of the element. */
  mode: PillMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  size?: PillSize;
}

const colorMap: Record<
  PillColor,
  Record<"solid" | "outline", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-primary)",
      "data-h2-background-color": "base(dt-primary)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-primary)",
      "data-h2-background-color": "base(light.dt-primary.10)",
      "data-h2-color": "base(dark.dt-primary)",
    },
  },
  secondary: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-secondary)",
      "data-h2-background-color": "base(light.dt-secondary)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-secondary)",
      "data-h2-background-color": "base(light.dt-secondary.10)",
      "data-h2-color": "base(dark.dt-secondary)",
    },
  },
  blue: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.tm-blue)",
      "data-h2-background-color": "base(light.tm-blue)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.tm-blue)",
      "data-h2-background-color": "base(light.tm-blue.10)",
      "data-h2-color": "base(dark.tm-blue)",
    },
  },
  green: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.tm-green)",
      "data-h2-background-color": "base(light.tm-green)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.tm-green)",
      "data-h2-background-color": "base(light.tm-green.10)",
      "data-h2-color": "base(dark.tm-green)",
    },
  },
  neutral: {
    solid: {
      /* not very visible - should probably be fixed before using */
      "data-h2-border": "base(all, 1px, solid, dark.dt-gray)",
      "data-h2-background-color": "base(dark.dt-gray)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-gray)",
      "data-h2-background-color": "base(dt-gray.10)",
      "data-h2-color": "base(dark.dt-gray)",
    },
  },
  error: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-error)",
      "data-h2-background-color": "base(dark.dt-error)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-error)",
      "data-h2-background-color": "base(light.dt-error.10)",
      "data-h2-color": "base(dark.dt-black)",
    },
  },
};

const sizeMap: Record<PillSize, Record<string, string>> = {
  sm: {
    "data-h2-font-size": "base(0.6rem)",
    "data-h2-padding": "base(x.1, x.25)",
  },
  md: {
    "data-h2-font-size": "base(caption)",
    "data-h2-padding": "base(x.25, x.75)",
  },
  lg: {
    "data-h2-font-size": "base(copy)",
    "data-h2-padding": "base(x.5, x1)",
  },
};

const Pill: React.FC<PillProps> = ({
  children,
  color,
  mode,
  size = "md",
  block = false,
  ...rest
}): React.ReactElement => {
  return (
    <span
      {...(block
        ? { "data-h2-display": "base(block)" }
        : { "data-h2-display": "base(inline-block)" })}
      data-h2-radius="base(m)"
      data-h2-font-size="base(caption)"
      {...colorMap[color][mode]}
      {...sizeMap[size]}
      data-h2-text-align="base(center)"
      data-h2-max-width="base(100%)"
      {...rest}
    >
      {children}
    </span>
  );
};

export default Pill;
