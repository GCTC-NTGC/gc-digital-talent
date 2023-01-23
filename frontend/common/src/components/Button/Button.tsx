import React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "cta"
  | "white"
  | "black"
  | "ia-primary"
  | "ia-secondary"
  | "yellow"
  | "red"
  | "blue"
  | "purple";

export type ButtonMode = "solid" | "outline" | "inline" | "tableHeader";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** The style type of the element. */
  color?: Color;
  /** The style mode of the element. */
  mode?: ButtonMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset";
  classNames?: string;
}

export const colorMap: Record<
  Color,
  Record<ButtonMode, Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "base(1px solid primary)",
      "data-h2-background-color": "base(primary) base:hover(primary.dark)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid primary)",
      "data-h2-background-color": "base(primary.10)",
      "data-h2-color": "base(primary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color":
        "base(transparent) base:focus-visible(primary.light.15)",
      "data-h2-color": "base(primary) base:focus-visible(primary.dark)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-border": "base(1px solid secondary.light)",
      "data-h2-background-color": "base(secondary.light)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid secondary.light)",
      "data-h2-background-color": "base(secondary.light.10)",
      "data-h2-color": "base(secondary.light)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(secondary.light)",
    },
    tableHeader: {
      "data-h2-border": "base(none)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-padding": "base(0)",
      "data-h2-color": "base(white)",
      "data-h2-font-weight": "base(700)",
      "data-h2-text-align": "base(left)",
    },
  },
  cta: {
    solid: {
      "data-h2-border": "base(1px solid dt-accent.dark)",
      "data-h2-background-color": "base(dt-accent.dark)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border": "base(1px solid dt-accent.dark)",
      "data-h2-background-color": "base(dt-accent.light.10)",
      "data-h2-color": "base(dt-accent.dark)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-accent.dark)",
    },
    tableHeader: {},
  },
  white: {
    solid: {
      "data-h2-border": "base(1px solid white)",
      "data-h2-background-color": "base(white)",
      "data-h2-color": "base(primary)",
    },
    outline: {
      "data-h2-border": "base(1px solid white)",
      "data-h2-background-color": "base(white.10)",
      "data-h2-color": "base(white)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(white)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-border": "base(1px solid black)",
      "data-h2-background-color": "base(black)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid black)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(black)",
    },
    tableHeader: {},
  },
  "ia-primary": {
    solid: {
      "data-h2-border": "base(1px solid primary)",
      "data-h2-background-color": "base(primary)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid primary)",
      "data-h2-background-color": "base(primary.light.10)",
      "data-h2-color": "base(primary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(primary)",
    },
    tableHeader: {},
  },
  "ia-secondary": {
    solid: {
      "data-h2-border": "base(1px solid secondary)",
      "data-h2-background-color": "base(secondary)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid secondary)",
      "data-h2-background-color": "base(secondary.light.10)",
      "data-h2-color": "base(secondary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(secondary)",
    },
    tableHeader: {},
  },
  yellow: {
    solid: {
      "data-h2-background-color":
        "base(tm-yellow) base:hover(tm-yellow.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tm-yellow) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid tm-yellow) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(tm-yellow.lighter) base:hover(tm-yellow) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(tm-yellow)",
    },
    tableHeader: {},
  },
  purple: {
    solid: {
      "data-h2-background-color":
        "base(primary) base:hover(primary.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid primary) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(primary.lighter) base:hover(primary) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(primary)",
    },
    tableHeader: {},
  },
  red: {
    solid: {
      "data-h2-background-color":
        "base(tertiary) base:hover(tertiary.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(tertiary.lighter) base:hover(tertiary) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(tertiary)",
    },
    tableHeader: {},
  },
  blue: {
    solid: {
      "data-h2-background-color":
        "base(secondary) base:hover(secondary.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(secondary.lighter) base:hover(secondary) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(secondary)",
    },
    tableHeader: {},
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      color = "primary",
      mode = "solid",
      disabled,
      block = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    let underline = {};
    if (mode === "inline") {
      underline = { "data-h2-text-decoration": "base(underline)" };
    }
    let padding = { "data-h2-padding": "base(x.5, x1)" };
    if (mode === "inline") {
      padding = { "data-h2-padding": "base(0)" };
    } else if (mode === "tableHeader") {
      padding = { "data-h2-padding": "base(x.5, 0)" };
    }
    return (
      <button
        ref={ref}
        className={`button ${classNames}`}
        // eslint-disable-next-line react/button-has-type
        type={type || "button"}
        disabled={disabled}
        data-h2-radius="base(s)"
        data-h2-font-size="base(copy)"
        data-h2-font-weight="base(700)"
        data-h2-transition="base:hover(background, .2s, ease, 0s)"
        {...(block
          ? { "data-h2-display": "base(block)" }
          : { "data-h2-display": "base(inline-block)" })}
        {...colorMap[color][mode]}
        {...padding}
        {...underline}
        style={{
          outlineOffset: 4,
          opacity: disabled ? "0.6" : undefined,
          width: block ? "100%" : "auto",
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default Button;
