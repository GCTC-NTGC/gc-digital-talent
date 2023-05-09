import React from "react";

import Heading from "../../Heading";
import { CardColor } from "./types";
import CardFlatLink, { CardFlatLinkProps } from "./CardFlatLink";

export interface CardFlatProps {
  color: CardColor;
  title: React.ReactNode;
  children?: React.ReactNode;
  links?: Array<
    Omit<CardFlatLinkProps, "color"> & {
      [key: `data-${string}`]: unknown;
      // add a natural key since mocked files do not have unique hrefs
      naturalKey?: string;
    }
  >;
}

const colorMap: Record<CardColor, Record<string, string>> = {
  primary: {
    "data-h2-border-left": "base(x.25 solid primary)",
  },
  secondary: {
    "data-h2-border-left": "base(x.25 solid secondary)",
  },
  tertiary: {
    "data-h2-border-left": "base(x.25 solid tertiary)",
  },
  quaternary: {
    "data-h2-border-left": "base(x.25 solid quaternary)",
  },
  quinary: {
    "data-h2-border-left": "base(x.25 solid quinary)",
  },
  black: {
    "data-h2-border-left": "base(x.25 solid black)",
  },
};

const CardFlat = ({ color, links, title, children }: CardFlatProps) => {
  return (
    <div
      {...colorMap[color]}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(0, 0, 0, x1)"
    >
      <Heading
        level="h3"
        size="h2"
        data-h2-font-size="base(h6)"
        data-h2-margin="base(0, 0, 0, 0)"
      >
        {title}
      </Heading>
      {children && (
        <div data-h2-flex-grow="base(1)" data-h2-margin-top="base(x.5)">
          {children}
        </div>
      )}
      {links && links.length > 0 ? (
        <div
          data-h2-margin-top="base(x1)"
          data-h2-display="base(flex)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-gap="base(x.25)"
        >
          {links.map((link) => (
            <CardFlatLink
              key={link.naturalKey ?? link.href}
              color={color}
              {...link}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CardFlat;
