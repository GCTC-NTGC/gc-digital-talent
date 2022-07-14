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
    "data-h2-bg-color": "b(lightpurple)",
    "data-h2-font-color": "b(white)",
  },
  "ts-secondary": {
    "data-h2-bg-color": "b(lightnavy)",
    "data-h2-font-color": "b(white)",
  },
  "ia-primary": {
    "data-h2-bg-color": "b(ia-pink)",
    "data-h2-font-color": "b(white)",
  },
  "ia-secondary": {
    "data-h2-bg-color": "b(ia-purple)",
    "data-h2-font-color": "b(white)",
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
      data-h2-display="b(block)"
      data-h2-radius="b(s)"
      data-h2-shadow="b(s)"
      {...rest}
    >
      <span
        className="card__header"
        data-h2-display="b(block)"
        data-h2-font-size="b(h5) l(h4)"
        data-h2-padding="b(all, s)"
        data-h2-margin="b(all, none)"
        data-h2-radius="b(s, s, none, none)"
        {...colorMap[color]}
      >
        {title}
      </span>
      <div
        className="card__body"
        data-h2-bg-color="b(white)"
        data-h2-radius="b(none, none, s, s)"
        data-h2-padding="b(all, s)"
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
