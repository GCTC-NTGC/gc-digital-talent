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
  mode: "solid" | "outline" | "inline";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  classNames?: string;
}

export const colorMap: Record<
  Color,
  Record<"solid" | "outline" | "inline", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "b(all, 1px, solid, dt-primary)",
      "data-h2-background-color": "b(dt-primary)",
      "data-h2-color": "b(dt-white)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, dt-primary)",
      "data-h2-background-color": "b(dt-primary.1)",
      "data-h2-color": "b(dt-primary)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-primary)",
    },
  },
  secondary: {
    solid: {
      "data-h2-border": "b(all, 1px, solid, dt-secondary)",
      "data-h2-background-color": "b(dt-secondary)",
      "data-h2-color": "b(dt-white)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, dt-secondary)",
      "data-h2-background-color": "b(dt-secondary.1)",
      "data-h2-color": "b(dt-secondary)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-secondary)",
    },
  },
  cta: {
    solid: {
      "data-h2-border": "b(all, 1px, solid, dark.dt-accent)",
      "data-h2-background-color": "b(dark.dt-accent)",
      "data-h2-color": "b(dt-black)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, dark.dt-accent)",
      "data-h2-background-color": "b(light.dt-accent.1)",
      "data-h2-color": "b(dark.dt-accent)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dark.dt-accent)",
    },
  },
  white: {
    solid: {
      "data-h2-border": "b(all, 1px, solid, dt-white)",
      "data-h2-background-color": "b(dt-white)",
      "data-h2-color": "b(light.dt-primary)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, dt-white)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-white)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-white)",
    },
  },
  black: {
    solid: {
      "data-h2-border": "b(all, 1px, solid, dt-white)",
      "data-h2-background-color": "b(dt-black)",
      "data-h2-color": "b(dt-white)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, dt-white)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-black)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(dt-black)",
    },
  },
  "ia-primary": {
    solid: {
      "data-h2-border": "b(all, 1px, solid, ia-primary)",
      "data-h2-background-color": "b(ia-primary)",
      "data-h2-color": "b(ia-white)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, ia-primary)",
      "data-h2-background-color": "b(light.ia-primary.1)",
      "data-h2-color": "b(ia-primary)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(ia-primary)",
    },
  },
  "ia-secondary": {
    solid: {
      "data-h2-border": "b(all, 1px, solid, ia-secondary)",
      "data-h2-background-color": "b(ia-secondary)",
      "data-h2-color": "b(ia-white)",
    },
    outline: {
      "data-h2-border": "b(all, 1px, solid, ia-secondary)",
      "data-h2-background-color": "b(light.ia-secondary.1)",
      "data-h2-color": "b(ia-secondary)",
    },
    inline: {
      "data-h2-border": "b(all, 1px, solid, transparent)",
      "data-h2-background-color": "b(transparent)",
      "data-h2-color": "b(ia-secondary)",
    },
  },
};

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  color,
  mode,
  block = false,
  classNames,
  ...rest
}): React.ReactElement => {
  return (
    <button
      className={`button ${classNames}`}
      // eslint-disable-next-line react/button-has-type
      type={type || "button"}
      data-h2-radius="b(s)"
      data-h2-padding="b(x.5, x.25)"
      data-h2-font-size="b(caption) m(copy)"
      data-h2-font-family="b(sans)"
      {...(block
        ? { "data-h2-display": "b(block)" }
        : { "data-h2-display": "b(inline-block)" })}
      {...colorMap[color][mode]}
      style={{
        width: block ? "100%" : "auto",
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
