import React from "react";
import omit from "lodash/omit";

import Link, { ExternalLink, type LinkProps } from "../../Link";
import { CardColor } from "./types";

export interface CardFlatLinkProps extends Pick<LinkProps, "href" | "mode"> {
  label: React.ReactNode;
  external?: boolean;
  color: CardColor;
}

const CardFlatLink = ({ external, color, ...link }: CardFlatLinkProps) => {
  const LinkEl = external ? ExternalLink : Link;

  return (
    <LinkEl
      color={color}
      type="button"
      weight="bold"
      mode="solid"
      {...omit(link, "label", "external")}
    >
      {link.label}
    </LinkEl>
  );
};

export default CardFlatLink;
