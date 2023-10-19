import React, { HTMLAttributes } from "react";

import { ScrollLinkClickFunc, ScrollToLink } from "../Link";

export interface AnchorLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  id: string;
}

const AnchorLink = ({ id, children }: AnchorLinkProps) => {
  const handleScrollTo: ScrollLinkClickFunc = (_, section) => {
    if (section) {
      section.focus();
    }
  };

  return (
    <ScrollToLink to={id} color="black" mode="text" onScrollTo={handleScrollTo}>
      {children}
    </ScrollToLink>
  );
};

export default AnchorLink;
