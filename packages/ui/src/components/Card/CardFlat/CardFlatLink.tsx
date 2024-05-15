import * as React from "react";
import omit from "lodash/omit";

import Link, { type LinkProps } from "../../Link";
import { CardColor } from "./types";

export interface CardFlatLinkProps extends Omit<LinkProps, "color"> {
  label: React.ReactNode;
  external?: boolean;
  color: CardColor;
}

const CardFlatLink = ({ color, ...link }: CardFlatLinkProps) => {
  return (
    <Link color={color} {...omit(link, "label", "naturalKey")}>
      {link.label}
    </Link>
  );
};

export default CardFlatLink;
