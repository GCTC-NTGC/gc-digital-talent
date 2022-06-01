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
  neutral: {
    solid: {
      /* not very visible - should probably be fixed before using */
      "data-h2-border": "b(darkgray, all, solid, s)",
      "data-h2-bg-color": "b(gray)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(darkgray, all, solid, s)",
      "data-h2-bg-color": "b(lightgray[.1])",
      "data-h2-font-color": "b(darkgray)",
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
      {/* parent span already has a display style */}
      <span
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-justify-content="b(center)"
      >
        {children}
      </span>
    </span>
  );
};

export default Pill;
