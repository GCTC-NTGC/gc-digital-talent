import React from "react";

type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "black"
  | "white";

export interface CardProps {
  title: string;
  subtitle?: string;
  color?: Color;
  bold?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
}

const colorMap = {
  primary: {
    "data-h2-background-color": "base:all(primary.light) base:iap:all(primary)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:iap:dark(secondary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color":
      "base:all(tertiary.light) base:iap(secondary) base:dark:iap(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base:all(quaternary.light) base:iap(secondary) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  black: {
    "data-h2-background-color":
      "base(gray.darkest) base:dark(foreground.shade)",
    "data-h2-color": "base:all(white)",
  },
  white: {
    "data-h2-background-color": "base(foreground) base:dark(foreground.tint)",
    "data-h2-color": "base:all(black)",
  },
};

const Card = ({
  title,
  subtitle,
  color = "primary",
  bold,
  children,
  noPadding,
  ...rest
}: CardProps & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className="card"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(rounded)"
      data-h2-overflow="base(hidden)"
      data-h2-shadow="base(medium)"
      {...rest}
    >
      {title && (
        <div
          className="card__header"
          data-h2-display="base(block) base:children[>span](block)"
          data-h2-padding="base(x1)"
          {...colorMap[color]}
        >
          <span
            data-h2-font-size="base(h6, 1)"
            {...(bold && { "data-h2-font-weight": "base(700)" })}
          >
            {title}
          </span>
          {subtitle && <span data-h2-margin="base(x.5 0 0 0)">{subtitle}</span>}
        </div>
      )}
      <div
        className="card__body"
        data-h2-background-color="base(foreground)"
        data-h2-color="base(black)"
        data-h2-flex-grow="base(1)"
        {...(noPadding
          ? { "data-h2-padding": "base(0)" }
          : { "data-h2-padding": "base(x1)" })}
        data-h2-flex="base(1)"
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
