import React from "react";

export type Color =
  | "ts-primary"
  | "ia-primary"
  | "ts-secondary"
  | "ia-secondary";

export interface CardProps {
  title: string;
  color?: Color;
  children: React.ReactNode;
}

const colorMap = {
  "ts-primary": {
    "data-h2-background-color": "base(dt-primary.light)",
    "data-h2-color": "base(dt-white)",
  },
  "ts-secondary": {
    "data-h2-background-color": "base(dt-secondary.light)",
    "data-h2-color": "base(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-primary)",
    "data-h2-color": "base(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary)",
    "data-h2-color": "base(ia-white)",
  },
};

const Card = ({
  title,
  color = "ts-primary",
  children,
  ...rest
}: CardProps & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className="card"
      data-h2-display="base(block)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(s)"
      {...rest}
    >
      <span
        className="card__header"
        data-h2-display="base(block)"
        data-h2-font-size="base(h5, 1) laptop(h4, 1)"
        data-h2-padding="base(x.5)"
        data-h2-margin="base(0)"
        data-h2-radius="base(s, s, 0, 0)"
        {...colorMap[color]}
      >
        {title}
      </span>
      <div
        className="card__body"
        data-h2-background-color="base(dt-white)"
        data-h2-radius="base(0, 0, s, s)"
        data-h2-padding="base(x.5)"
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
