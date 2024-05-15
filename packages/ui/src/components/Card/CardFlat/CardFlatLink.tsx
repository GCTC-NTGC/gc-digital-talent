import omit from "lodash/omit";
import { ReactNode } from "react";

import Link, { type LinkProps } from "../../Link";
import { CardColor } from "./types";

export interface CardFlatLinkProps extends Omit<LinkProps, "color"> {
  label: ReactNode;
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
