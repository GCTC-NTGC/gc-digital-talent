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
      "data-h2-border": "b(lightpurple, all, solid, s)",
      "data-h2-bg-color": "b(lightpurple)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(lightpurple, all, solid, s)",
      "data-h2-bg-color": "b([light]lightpurple[.1])",
      "data-h2-font-color": "b(lightpurple)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(lightpurple)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-border": "b(lightnavy, all, solid, s)",
      "data-h2-bg-color": "b(lightnavy)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(lightnavy, all, solid, s)",
      "data-h2-bg-color": "b([light]lightnavy[.1])",
      "data-h2-font-color": "b(lightnavy)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(lightnavy)",
    },
    tableHeader: {
      "data-h2-border": "b(lightnavy, all, solid, s)",
      "data-h2-bg-color": "b(lightnavy)",
      "data-h2-padding": "b(all, none)",
      "data-h2-font-color": "b(white)",
      "data-h2-font-weight": "b(800)",
      "data-h2-text-align": "b(left)",
      "data-h2-font-size": "b(caption)",
    },
  },
  cta: {
    solid: {
      "data-h2-border": "b(darkgold, all, solid, s)",
      "data-h2-bg-color": "b(darkgold)",
      "data-h2-font-color": "b(black)",
    },
    outline: {
      "data-h2-border": "b(darkgold, all, solid, s)",
      "data-h2-bg-color": "b([light]darkgold[.1])",
      "data-h2-font-color": "b(darkgold)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(darkgold)",
    },
    tableHeader: {},
  },
  white: {
    solid: {
      "data-h2-border": "b(white, all, solid, s)",
      "data-h2-bg-color": "b(white)",
      "data-h2-font-color": "b(lightpurple)",
    },
    outline: {
      "data-h2-border": "b(white, all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(white)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(white)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-border": "b(black, all, solid, s)",
      "data-h2-bg-color": "b(black)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(black, all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(black)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(black)",
    },
    tableHeader: {},
  },
  "ia-primary": {
    solid: {
      "data-h2-border": "b(ia-pink, all, solid, s)",
      "data-h2-bg-color": "b(ia-pink)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(ia-pink, all, solid, s)",
      "data-h2-bg-color": "b([light]ia-pink[.1])",
      "data-h2-font-color": "b(ia-pink)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(ia-pink)",
    },
    tableHeader: {},
  },
  "ia-secondary": {
    solid: {
      "data-h2-border": "b(ia-purple, all, solid, s)",
      "data-h2-bg-color": "b(ia-purple)",
      "data-h2-font-color": "b(white)",
    },
    outline: {
      "data-h2-border": "b(ia-purple, all, solid, s)",
      "data-h2-bg-color": "b([light]ia-purple[.1])",
      "data-h2-font-color": "b(ia-purple)",
    },
    inline: {
      "data-h2-border": "b([light]white[0], all, solid, s)",
      "data-h2-bg-color": "b([light]white[0])",
      "data-h2-font-color": "b(ia-purple)",
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
        data-h2-radius="b(s)"
        data-h2-padding="b(top-bottom, xs) b(right-left, s)"
        data-h2-font-size="b(caption) m(normal)"
        data-h2-font-family="b(sans)"
        {...(block
          ? { "data-h2-display": "b(block)" }
          : { "data-h2-display": "b(inline-block)" })}
        {...colorMap[color][mode]}
        style={{
          opacity: disabled ? "0.6" : undefined,
          width: block ? "100%" : "auto",
        }}
        {...rest}
      >
        Download
      </button>
    );
  },
);

export default Button;
