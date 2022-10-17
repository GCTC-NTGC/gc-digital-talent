import React from "react";

import Heading from "../Heading";
import type { Color } from "../Button";
import Link, { type LinkProps } from "../Link";

type CardColor = Extract<Color, "yellow" | "red" | "blue" | "black" | "purple">;

export interface CardFlatProps {
  color: CardColor;
  title: React.ReactNode;
  children?: React.ReactNode;
  link?: Pick<LinkProps, "href" | "label" | "mode">;
}

const colorMap: Record<CardColor, Record<string, string>> = {
  yellow: {
    "data-h2-border": "base(left, x.25, solid, tm-yellow)",
  },
  red: {
    "data-h2-border": "base(left, x.25, solid, tm-red)",
  },
  blue: {
    "data-h2-border": "base(left, x.25, solid, tm-blue)",
  },
  black: {
    "data-h2-border": "base(left, x.25, solid, black)",
  },
  purple: {
    "data-h2-border": "base(left, x.25, solid, tm-purple)",
  },
};

const CardFlat = ({ color, link, title, children }: CardFlatProps) => (
  <div
    {...colorMap[color]}
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-padding="base(0, 0, 0, x1)"
  >
    <Heading
      level="h3"
      data-h2-font-size="base(h6)"
      data-h2-margin="base(0, 0, x0.25, 0)"
    >
      {title}
    </Heading>
    {children && (
      <div data-h2-flex-grow="base(1)" data-h2-margin="base(x1, 0)">
        {children}
      </div>
    )}
    {link && (
      <div>
        <Link color={color} type="button" weight="bold" {...link}>
          {link.label}
        </Link>
      </div>
    )}
  </div>
);

export default CardFlat;
