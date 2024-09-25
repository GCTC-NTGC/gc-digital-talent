import omit from "lodash/omit";
import { ReactNode } from "react";

import Link, { type LinkProps } from "../../Link";
import { CardColor } from "./types";

export interface CardFlatRegularLinkProps
  extends Omit<LinkProps, "color" | "label"> {
  label: ReactNode;
  color: CardColor;
}

const CardFlatRegularLink = (link: CardFlatRegularLinkProps) => {
  return <Link {...omit(link, "label", "naturalKey")}>{link.label}</Link>;
};

export default CardFlatRegularLink;
