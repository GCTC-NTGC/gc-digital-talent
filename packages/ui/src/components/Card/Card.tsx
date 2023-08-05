import React from "react";

type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "white";

export interface CardProps {
  title: string;
  color?: Color;
  bold?: boolean;
  children: React.ReactNode;
}

const colorMap = {
  primary: {
    "data-h2-background-color":
      "base:all(primary.light) base:dark:iap(primary)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:dark:admin(secondary.lighter) base:dark:iap(secondary.light)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color": "base(tertiary) base:dark:iap(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base(quaternary) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  white: {
    "data-h2-background-color": "base(white)",
    "data-h2-color": "base:all(black)",
  },
};

const Card = ({
  title,
  color = "primary",
  bold,
  children,
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
        <span
          className="card__header"
          data-h2-display="base(block)"
          data-h2-font-size="base(h5, 1)"
          data-h2-padding="base(x1)"
          data-h2-margin="base(0)"
          {...(bold && { "data-h2-font-weight": "base(700)" })}
          {...colorMap[color]}
        >
          {title}
        </span>
      )}
      <div
        className="card__body"
        data-h2-background-color="base(foreground)"
        data-h2-flex-grow="base(1)"
        data-h2-padding="base(x1)"
        data-h2-flex="base(1)"
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
