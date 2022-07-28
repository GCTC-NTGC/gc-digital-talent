import React from "react";

export interface PillProps extends React.HTMLProps<HTMLSpanElement> {
  /** The style type of the element. */
  color: "primary" | "secondary" | "neutral";
  /** The style mode of the element. */
  mode: "solid" | "outline";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
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

const Pill: React.FC<PillProps> = ({
  children,
  color,
  mode,
  block = false,
  ...rest
}): React.ReactElement => {
  return (
    <span
      data-h2-padding="base(x.25, x.75)"
      {...(block
        ? { "data-h2-display": "base(block)" }
        : { "data-h2-display": "base(inline-block)" })}
      data-h2-radius="base(m)"
      data-h2-font-size="base(caption)"
      {...colorMap[color][mode]}
      data-h2-margin="base(x.125)"
      data-h2-text-align="base(center)"
      {...rest}
    >
      {/* parent span already has a display style */}
      <span

      >
        {children}
      </span>
    </span>
  );
};

export default Pill;
