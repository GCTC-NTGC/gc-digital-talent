import React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "cta"
  | "white"
  | "black"
  | "ia-primary"
  | "ia-secondary";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** The style type of the element. */
  color: Color;
  /** The style mode of the element. */
  mode: "solid" | "outline" | "inline" | "tableHeader";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  classNames?: string;
}

export const colorMap: Record<
  Color,
  Record<"solid" | "outline" | "inline" | "tableHeader", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dt-primary)",
      "data-h2-background-color": "base(dt-primary) base:hover(dark.dt-primary)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dt-primary)",
      "data-h2-background-color": "base(dt-primary.1)",
      "data-h2-color": "base(dt-primary)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-primary)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dt-secondary)",
      "data-h2-background-color": "base(dt-secondary)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dt-secondary)",
      "data-h2-background-color": "base(dt-secondary.1)",
      "data-h2-color": "base(dt-secondary)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-secondary)",
    },
    tableHeader: {
      "data-h2-border": "base(all, 1px, solid, dt-secondary.light)",
      "data-h2-background-color": "base(dt-secondary.light)",
      "data-h2-padding": "base(0)",
      "data-h2-color": "base(white)",
      "data-h2-font-weight": "base(800)",
      "data-h2-text-align": "base(left)",
      "data-h2-font-size": "base(caption)",
    },
  },
  cta: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-accent)",
      "data-h2-background-color": "base(dark.dt-accent)",
      "data-h2-color": "base(dt-black)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dark.dt-accent)",
      "data-h2-background-color": "base(light.dt-accent.1)",
      "data-h2-color": "base(dark.dt-accent)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dark.dt-accent)",
    },
    tableHeader: {},
  },
  white: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dt-white)",
      "data-h2-background-color": "base(dt-white)",
      "data-h2-color": "base(light.dt-primary)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dt-white)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-white)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-white)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-border": "base(all, 1px, solid, dt-black)",
      "data-h2-background-color": "base(dt-black)",
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, dt-black)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-black)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(dt-black)",
    },
    tableHeader: {},
  },
  "ia-primary": {
    solid: {
      "data-h2-border": "base(all, 1px, solid, ia-primary)",
      "data-h2-background-color": "base(ia-primary)",
      "data-h2-color": "base(ia-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, ia-primary)",
      "data-h2-background-color": "base(light.ia-primary.1)",
      "data-h2-color": "base(ia-primary)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(ia-primary)",
    },
    tableHeader: {},
  },
  "ia-secondary": {
    solid: {
      "data-h2-border": "base(all, 1px, solid, ia-secondary)",
      "data-h2-background-color": "base(ia-secondary)",
      "data-h2-color": "base(ia-white)",
    },
    outline: {
      "data-h2-border": "base(all, 1px, solid, ia-secondary)",
      "data-h2-background-color": "base(light.ia-secondary.1)",
      "data-h2-color": "base(ia-secondary)",
    },
    inline: {
      "data-h2-border": "base(all, 1px, solid, transparent)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-color": "base(ia-secondary)",
    },
    tableHeader: {},
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type,
      color,
      mode,
      disabled,
      block = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`button ${classNames}`}
        // eslint-disable-next-line react/button-has-type
        type={type || "button"}
        disabled={disabled}
        data-h2-radius="base(input)"
        data-h2-padding="base(x.5, x1)"
        data-h2-font-size="base(copy)"
        data-h2-transition="base:hover(background, .2s, ease, 0s)"
        {...(block
          ? { "data-h2-display": "base(block)" }
          : { "data-h2-display": "base(inline-block)" })}
        {...colorMap[color][mode]}
        style={{
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
