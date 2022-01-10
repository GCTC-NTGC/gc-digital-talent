import React from "react";

export interface PillProps extends React.HTMLProps<HTMLSpanElement> {
  /** The style type of the element. */
  color: "primary" | "secondary";
  /** The style mode of the element. */
  mode: "solid" | "outline";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
}

const colorMap: Record<
  "primary" | "secondary",
  Record<"solid" | "outline", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "b(darkpurple, all, solid, s)",
      "data-h2-bg-color": "b(lightpurple)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(darkpurple, all, solid, s)",
      "data-h2-bg-color": "b(lightpurple[.1])",
      "data-h2-font-color": "b(darkpurple)",
    },
  },
  secondary: {
    solid: {
      "data-h2-border": "b(darknavy, all, solid, s)",
      "data-h2-bg-color": "b(lightnavy)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(darknavy, all, solid, s)",
      "data-h2-bg-color": "b(lightnavy[.1])",
      "data-h2-font-color": "b(darknavy)",
    },
  },
};

export const Pill: React.FC<PillProps> = ({
  children,
  color,
  mode,
  block = false,
  ...rest
}): React.ReactElement => {
  return (
    <span
      data-h2-padding="b(all, xs)"
      {...(block
        ? { "data-h2-display": "b(block)" }
        : { "data-h2-display": "b(inline-block)" })}
      data-h2-radius="b(m)"
      data-h2-font-size="b(caption)"
      data-h2-font-family="b(sans)"
      {...colorMap[color][mode]}
      data-h2-margin="b(all, xxs)"
      data-h2-text-align="b(center)"
      {...rest}
    >
      {children}
    </span>
  );
};

export default Pill;
