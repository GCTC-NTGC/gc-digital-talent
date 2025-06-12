import omit from "lodash/omit";
import { ReactNode } from "react";

import { ScrollToLink, type ScrollToLinkProps } from "../../Link";

export interface CardFlatScrollToLinkProps
  extends Omit<ScrollToLinkProps, "label"> {
  label: ReactNode;
}

const CardFlatScrollToLink = (link: CardFlatScrollToLinkProps) => {
  return (
    <ScrollToLink {...omit(link, "label", "naturalKey")}>
      {link.label}
    </ScrollToLink>
  );
};

export default CardFlatScrollToLink;
