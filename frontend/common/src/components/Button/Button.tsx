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
      "data-h2-border": "base(1px solid dt-primary)",
      "data-h2-background-color":
        "base(dt-primary) base:hover(dt-primary.dark)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(1px solid dt-primary)",
      "data-h2-background-color": "base(dt-primary.10)",
      "data-h2-color": "base(dt-primary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color":
        "base(transparent) base:focus-visible(dt-primary.light.15)",
      "data-h2-color": "base(dt-primary) base:focus-visible(dt-primary.dark)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-border": "base(1px solid dt-secondary.light)",
      "data-h2-background-color": "base(dt-secondary.light)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(1px solid dt-secondary.light)",
      "data-h2-background-color": "base(dt-secondary.light.10)",
      "data-h2-color": "base(dt-secondary.light)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-secondary.light)",
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
      "data-h2-color": "base(dt-black)",
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
      "data-h2-border": "base(1px solid dt-white)",
      "data-h2-background-color": "base(dt-white)",
      "data-h2-color": "base(dt-primary)",
    },
    outline: {
      "data-h2-border": "base(1px solid dt-white)",
      "data-h2-background-color": "base(dt-white.10)",
      "data-h2-color": "base(dt-white)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-white)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-border": "base(1px solid dt-black)",
      "data-h2-background-color": "base(dt-black)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(1px solid dt-black)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-black)",
    },
    tableHeader: {},
  },
  "ia-primary": {
    solid: {
      "data-h2-border": "base(1px solid ia-primary)",
      "data-h2-background-color": "base(ia-primary)",
      "data-h2-color": "base(ia-white)",
    },
    outline: {
      "data-h2-border": "base(1px solid ia-primary)",
      "data-h2-background-color": "base(ia-primary.light.10)",
      "data-h2-color": "base(ia-primary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(ia-primary)",
    },
    tableHeader: {},
  },
  "ia-secondary": {
    solid: {
      "data-h2-border": "base(1px solid ia-secondary)",
      "data-h2-background-color": "base(ia-secondary)",
      "data-h2-color": "base(ia-white)",
    },
    outline: {
      "data-h2-border": "base(1px solid ia-secondary)",
      "data-h2-background-color": "base(ia-secondary.light.10)",
      "data-h2-color": "base(ia-secondary)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(ia-secondary)",
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
        "base(tm-purple) base:hover(tm-purple.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tm-purple) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid tm-purple) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(tm-purple.lighter) base:hover(tm-purple) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(tm-purple)",
    },
    tableHeader: {},
  },
  red: {
    solid: {
      "data-h2-background-color":
        "base(tm-red) base:hover(tm-red.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tm-red) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid tm-red) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(tm-red.lighter) base:hover(tm-red) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(tm-red)",
    },
    tableHeader: {},
  },
  blue: {
    solid: {
      "data-h2-background-color":
        "base(tm-blue) base:hover(tm-blue.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tm-blue) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
    },
    outline: {
      "data-h2-border":
        "base(3px solid tm-blue) base:focus-visible(3px solid focus)",
      "data-h2-background-color":
        "base(tm-blue.lighter) base:hover(tm-blue) base:focus-visible(focus) base:active(transparent)",
      "data-h2-color": "base(black)",
    },
    inline: {
      "data-h2-border": "base(1px solid transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(tm-blue)",
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
