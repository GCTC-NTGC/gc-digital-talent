import type { LinkProps } from "./Link";
import { colorMap, Color } from "../Button/Button";

interface CommonLinkStyleArgs
  extends Pick<LinkProps, "color" | "mode" | "block" | "type" | "weight"> {
  disabled?: boolean;
}

const linkColorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-color": "base(primary) base:hover(primary.darker)",
  },
  secondary: {
    "data-h2-color": "base(secondary) base:hover(secondary.darker)",
  },
  tertiary: {
    "data-h2-color": "base(tertiary) base:hover(tertiary.darker)",
  },
  quaternary: {
    "data-h2-color": "base(quaternary) base:hover(quaternary.darker)",
  },
  quinary: {
    "data-h2-color": "base(quinary) base:hover(quinary.darker)",
  },
  success: {
    "data-h2-color": "base(success) base:hover(success.darker)",
  },
  warning: {
    "data-h2-color": "base(warning) base:hover(warning.darker)",
  },
  error: {
    "data-h2-color": "base(error) base:hover(error.darker)",
  },
  black: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  white: {
    "data-h2-color": "base(white) base:hover(primary)",
  },
  "ia-primary": {
    "data-h2-color": "base(primary) base:hover(primary.darker)",
  },
  "ia-secondary": {
    "data-h2-color": "base(secondary) base:hover(secondary.darker)",
  },
  purple: {
    "data-h2-color": "base(primary) base:hover(primary.darker)",
  },
  blue: {
    "data-h2-color": "base(secondary) base:hover(secondary.darker)",
  },
  red: {
    "data-h2-color": "base(tertiary) base:hover(tertiary.darker)",
  },
  yellow: {
    "data-h2-color": "base(quaternary) base:hover(quaternary.darker)",
  },
  cta: {
    "data-h2-color": "base(tertiary) base:hover(tertiary.darker)",
  },
};

const useCommonLinkStyles = ({
  color,
  mode,
  block,
  type,
  weight,
  disabled,
}: CommonLinkStyleArgs) => {
  let weightStyle = {};
  if (weight && weight === "bold") {
    weightStyle = { "data-h2-font-weight": "base(700)" };
  }
  let padding = { "data-h2-padding": "base(x.5, x1)" };
  if (mode === "inline") {
    padding = { "data-h2-padding": "base(0)" };
  }
  return type === "button"
    ? {
        "data-h2-radius": "base(s)",
        ...padding,
        "data-h2-font-size": "base(copy)",
        ...weightStyle,
        ...(disabled && {
          style: { opacity: 0.6, pointerEvents: "none" } as React.CSSProperties,
        }),
        ...(color && mode ? { ...colorMap[color][mode] } : {}),
        ...(block
          ? {
              "data-h2-display": "base(block)",
              "data-h2-text-align": "base(center)",
            }
          : { "data-h2-display": "base(inline-block)" }),
      }
    : {
        ...(color
          ? { ...linkColorMap[color] }
          : { "data-h2-color": "base:hover(primary)" }),
        ...weightStyle,
        "data-h2-text-decoration": "base(underline) base:hover(none)",
      };
};

export default useCommonLinkStyles;
