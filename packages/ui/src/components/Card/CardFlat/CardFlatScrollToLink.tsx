import omit from "lodash/omit";
import { ReactNode } from "react";

import { ScrollToLink, type ScrollToLinkProps } from "../../Link";
import { CardColor } from "./types";

export interface CardFlatScrollToLinkProps
  extends Omit<ScrollToLinkProps, "color" | "label"> {
  label: ReactNode;
  color: CardColor;
}

const CardFlatScrollToLink = (link: CardFlatScrollToLinkProps) => {
  return (
    <ScrollToLink {...omit(link, "label", "naturalKey")}>
      {link.label}
    </ScrollToLink>
  );
};

export default CardFlatScrollToLink;
