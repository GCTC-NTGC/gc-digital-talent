import React from "react";

type PillSize = "sm" | "md" | "lg";

export interface PillProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "size"> {
  /** The style type of the element. */
  color: "primary" | "secondary" | "neutral";
  /** The style mode of the element. */
  mode: "solid" | "outline";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  size?: PillSize;
}

const colorMap: Record<
  "primary" | "secondary" | "neutral",
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
      "data-h2-background-color": "base(light.dt-primary.1)",
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
      "data-h2-background-color": "base(light.dt-secondary.1)",
      "data-h2-color": "base(dark.dt-secondary)",
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
      "data-h2-background-color": "base(dt-gray.1)",
      "data-h2-color": "base(dark.dt-gray)",
    },
  },
};

const sizeMap: Record<PillSize, Record<string, string>> = {
  sm: {
    "data-h2-font-size": "base(0.6rem)",
    "data-h2-padding": "base(x.1, x.25)",
  },
  md: {
    "data-h2-padding": "base(x.25, x.75)",
    "data-h2-font-size": "base(caption)",
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
      {...rest}
    >
      {/* parent span already has a display style */}
      <span>{children}</span>
    </span>
  );
};

export default Pill;
