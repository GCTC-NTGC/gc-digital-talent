import React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "success"
  | "warning"
  | "error"
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
      "data-h2-background-color":
        "base(primary.light) base:hover(primary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary.light) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(primary.30) base:hover(primary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(primary.dark) base:hover(primary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-background-color":
        "base(secondary) base:hover(secondary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(secondary.30) base:hover(secondary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(secondary.dark) base:hover(secondary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
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
  tertiary: {
    solid: {
      "data-h2-background-color":
        "base(tertiary) base:hover(tertiary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(tertiary.30) base:hover(tertiary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(tertiary.dark) base:hover(tertiary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  quaternary: {
    solid: {
      "data-h2-background-color":
        "base(quaternary) base:hover(quaternary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quaternary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(quaternary.30) base:hover(quaternary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quaternary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(quaternary.dark) base:hover(quaternary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  quinary: {
    solid: {
      "data-h2-background-color":
        "base(quinary) base:hover(quinary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quinary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(quinary.30) base:hover(quinary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quinary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(quinary.dark) base:hover(quinary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  success: {
    solid: {
      "data-h2-background-color":
        "base(success.light) base:hover(success.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid success.light) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(success.30) base:hover(success.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid success) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(success.dark) base:hover(success.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  warning: {
    solid: {
      "data-h2-background-color":
        "base(warning) base:hover(warning.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid warning) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(warning.30) base:hover(warning.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid warning) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(warning.dark) base:hover(warning.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  error: {
    solid: {
      "data-h2-background-color":
        "base(error.light) base:hover(error.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid error.light) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(error.30) base:hover(error.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid error) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(error.dark) base:hover(error.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-background-color":
        "base(black) base:hover(black.light) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid black) base:focus-visible(3px solid focus)",
      "data-h2-color":
        "base(white) base:active(black) base:focus-visible(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(black.30) base:hover(black.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid black) base:focus-visible(3px solid focus)",
      "data-h2-color": "base:active(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(black.dark) base:hover(black.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  white: {
    solid: {
      "data-h2-background-color":
        "base(white) base:hover(white.dark) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid white) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black) base:active(white)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(white.30) base:hover(white.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid white) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(white)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(white) base:hover(white.dark) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  "ia-primary": {
    solid: {
      "data-h2-background-color":
        "base(primary.light) base:hover(primary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary.light) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(primary.30) base:hover(primary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(primary.dark) base:hover(primary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  "ia-secondary": {
    solid: {
      "data-h2-background-color":
        "base(secondary) base:hover(secondary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(secondary.30) base:hover(secondary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(secondary.dark) base:hover(secondary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  purple: {
    solid: {
      "data-h2-background-color":
        "base(primary.light) base:hover(primary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary.light) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(primary.30) base:hover(primary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid primary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(primary.dark) base:hover(primary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  blue: {
    solid: {
      "data-h2-background-color":
        "base(secondary) base:hover(secondary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(secondary.30) base:hover(secondary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid secondary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(secondary.dark) base:hover(secondary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  red: {
    solid: {
      "data-h2-background-color":
        "base(tertiary) base:hover(tertiary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(tertiary.30) base:hover(tertiary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(tertiary.dark) base:hover(tertiary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  yellow: {
    solid: {
      "data-h2-background-color":
        "base(quaternary) base:hover(quaternary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quaternary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(quaternary.30) base:hover(quaternary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid quaternary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(quaternary.dark) base:hover(quaternary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
    },
    tableHeader: {},
  },
  cta: {
    solid: {
      "data-h2-background-color":
        "base(tertiary) base:hover(tertiary.lightest) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    outline: {
      "data-h2-background-color":
        "base(tertiary.30) base:hover(tertiary.50) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(3px solid tertiary) base:focus-visible(3px solid focus)",
      "data-h2-color": "base(black)",
      "data-h2-font-weight": "base(700)",
    },
    inline: {
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border": "base(3px solid transparent)",
      "data-h2-color":
        "base(tertiary.dark) base:hover(tertiary.light) base:focus-visible(white)",
      "data-h2-font-weight": "base(700)",
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
        data-h2-transition="base:hover(background .2s ease 0s)"
        data-h2-cursor="base(pointer)"
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
