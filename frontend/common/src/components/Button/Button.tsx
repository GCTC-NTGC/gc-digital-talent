import React from "react";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** The style type of the element. */
  color: "primary" | "secondary" | "cta" | "white";
  /** The style mode of the element. */
  mode: "solid" | "outline" | "inline";
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const colorMap: Record<
  "primary" | "secondary" | "cta" | "white",
  Record<"solid" | "outline" | "inline", Record<string, string>>
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
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type,
  color,
  mode,
  block = false,
  ...rest
}): React.ReactElement => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || "button"}
      data-h2-radius="b(s)"
      data-h2-padding="b(top-bottom, xs) b(right-left, s)"
      data-h2-font-size="b(caption) m(normal)"
      {...(block
        ? { "data-h2-display": "b(block)" }
        : { "data-h2-display": "b(inline-block)" })}
      {...colorMap[color][mode]}
      style={{
        cursor: "pointer",
        overflowWrap: "break-word",
        width: block ? "100%" : "auto",
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
