import omit from "lodash/omit";
import { ReactNode } from "react";

import Link, { type LinkProps } from "../../Link";

export interface CardFlatRegularLinkProps extends Omit<LinkProps, "label"> {
  label: ReactNode;
}

const CardFlatRegularLink = (link: CardFlatRegularLinkProps) => {
  return <Link {...omit(link, "label", "naturalKey")}>{link.label}</Link>;
};

export default CardFlatRegularLink;
