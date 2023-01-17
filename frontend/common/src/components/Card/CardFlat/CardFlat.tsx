import React from "react";
import omit from "lodash/omit";

import Heading from "../../Heading";
import type { Color } from "../../Button";
import Link, { ExternalLink, type LinkProps } from "../../Link";

type CardColor = Extract<Color, "yellow" | "red" | "blue" | "black" | "purple">;

interface CardFlatLinkProps extends Pick<LinkProps, "href" | "mode"> {
  label: string;
  external?: boolean;
}
export interface CardFlatProps {
  color: CardColor;
  title: React.ReactNode;
  children?: React.ReactNode;
  link?: CardFlatLinkProps;
}

const colorMap: Record<CardColor, Record<string, string>> = {
  yellow: {
    "data-h2-border-left": "base(x.25 solid tm-yellow)",
  },
  red: {
    "data-h2-border-left": "base(x.25 solid tm-red)",
  },
  blue: {
    "data-h2-border-left": "base(x.25 solid tm-blue)",
  },
  black: {
    "data-h2-border-left": "base(x.25 solid black)",
  },
  purple: {
    "data-h2-border-left": "base(x.25 solid tm-purple)",
  },
};

const CardFlat = ({ color, link, title, children }: CardFlatProps) => {
  const LinkEl = link?.external ? ExternalLink : Link;
  return (
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
          <LinkEl
            color={color}
            type="button"
            weight="bold"
            mode="solid"
            {...omit(link, "label", "external")}
          >
            {link.label}
          </LinkEl>
        </div>
      )}
    </div>
  );
};

export default CardFlat;
