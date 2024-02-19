import React from "react";

import { Color, IconType } from "../../types";

export type PillSize = "sm" | "md" | "lg";
export type PillMode = "solid" | "outline";

export interface PillProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "size"> {
  /** The style type of the element. */
  color: Color;
  /** The style mode of the element. */
  mode: PillMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  size?: PillSize;
  bold?: boolean;
  icon?: IconType;
}

const h2ChipColors = {
  primary: {
    solid: {
      "data-h2-border": "base(1px solid primary.light)",
      "data-h2-background-color": "base(primary.light) base:iap(primary)",
      "data-h2-color": "base(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid primary.darker)",
      "data-h2-background-color": "base(primary.lightest)",
      "data-h2-color": "base(primary.darker)",
    },
  },
  secondary: {
    solid: {
      "data-h2-border": "base(1px solid secondary)",
      "data-h2-background-color": "base(secondary)",
      "data-h2-color": "base:all(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid secondary.darker)",
      "data-h2-background-color": "base(secondary.lightest)",
      "data-h2-color": "base(secondary.darker)",
    },
  },
  secondaryDarkFixed: {
    solid: {
      "data-h2-border": "base(1px solid secondary)",
      "data-h2-background-color": "base(secondary)",
      "data-h2-color": "base:all(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base:all(1px solid secondary.lighter)",
      "data-h2-background-color": "base:all(secondary.darkest)",
      "data-h2-color": "base:all(secondary.lighter)",
    },
  },
  tertiary: {
    solid: {
      "data-h2-border": "base(1px solid tertiary)",
      "data-h2-background-color": "base(tertiary)",
      "data-h2-color": "base:all(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid tertiary.darker)",
      "data-h2-background-color": "base(tertiary.lightest)",
      "data-h2-color": "base(tertiary.darker)",
    },
  },
  quaternary: {
    solid: {
      "data-h2-border": "base(1px solid quaternary)",
      "data-h2-background-color": "base(quaternary)",
      "data-h2-color": "base:all(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid quaternary.darker)",
      "data-h2-background-color": "base(quaternary.lightest)",
      "data-h2-color": "base(quaternary.darker)",
    },
  },
  quinary: {
    solid: {
      "data-h2-border": "base(1px solid quinary)",
      "data-h2-background-color": "base(quinary)",
      "data-h2-color": "base:all(black) base:iap:all(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid quinary.darker)",
      "data-h2-background-color": "base(quinary.lightest)",
      "data-h2-color": "base(quinary.darker)",
    },
  },
  success: {
    solid: {
      "data-h2-border": "base(1px solid success.light)",
      "data-h2-background-color": "base(success.light)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border": "base(1px solid success.darker)",
      "data-h2-background-color": "base(success.lightest)",
      "data-h2-color": "base(success.darker)",
    },
  },
  warning: {
    solid: {
      "data-h2-border": "base(1px solid warning)",
      "data-h2-background-color": "base(warning)",
      "data-h2-color": "base:all(black)",
    },
    outline: {
      "data-h2-border": "base(1px solid warning.darker)",
      "data-h2-background-color": "base(warning.lightest)",
      "data-h2-color": "base(warning.darker)",
    },
  },
  error: {
    solid: {
      "data-h2-border": "base(1px solid error.light)",
      "data-h2-background-color": "base(error.light)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border": "base(1px solid error.darker)",
      "data-h2-background-color": "base(error.lightest)",
      "data-h2-color": "base(error.darker)",
    },
  },
  black: {
    solid: {
      "data-h2-border": "base(1px solid gray.light)",
      "data-h2-background-color": "base(gray.light)",
      "data-h2-color": "base:all(black)",
    },
    outline: {
      "data-h2-border": "base(1px solid gray.darker)",
      "data-h2-background-color": "base(gray.lightest)",
      "data-h2-color": "base(gray.darker)",
    },
  },
  blackFixed: {
    solid: {
      "data-h2-border": "base:all(1px solid gray.light)",
      "data-h2-background-color": "base:all(gray.light)",
      "data-h2-color": "base:all(black)",
    },
    outline: {
      "data-h2-border": "base:all(1px solid gray.darker)",
      "data-h2-background-color": "base:all(gray.lightest)",
      "data-h2-color": "base:all(gray.darker)",
    },
  },
};

const colorMap: Record<
  Color,
  Record<"solid" | "outline", Record<string, string>>
> = {
  primary: h2ChipColors.primary,
  secondary: h2ChipColors.secondary,
  secondaryDarkFixed: h2ChipColors.secondaryDarkFixed,
  tertiary: h2ChipColors.tertiary,
  quaternary: h2ChipColors.quaternary,
  quinary: h2ChipColors.quinary,
  success: h2ChipColors.success,
  warning: h2ChipColors.warning,
  error: h2ChipColors.error,
  black: h2ChipColors.black,
  blackFixed: h2ChipColors.blackFixed,
  white: h2ChipColors.black,
  whiteFixed: h2ChipColors.black,
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

const Pill = ({
  children,
  color,
  mode,
  icon,
  size = "md",
  block = false,
  bold = false,
  ...rest
}: PillProps) => {
  const Icon = icon;
  return (
    <span
      {...(block
        ? { "data-h2-display": "base(flex)" }
        : { "data-h2-display": "base(inline-flex)" })}
      data-h2-align-items="base(center)"
      data-h2-gap="base(0 x.25)"
      data-h2-radius="base(m)"
      data-h2-font-size="base(caption)"
      {...colorMap[color][mode]}
      {...sizeMap[size]}
      data-h2-text-align="base(center)"
      data-h2-max-width="base(100%)"
      {...(bold ? { "data-h2-font-weight": "base(700)" } : {})}
      {...rest}
    >
      {Icon && (
        <Icon
          data-h2-height="base(1rem)"
          data-h2-width="base(1rem)"
          data-h2-flex-shrink="base(0)"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Pill;
