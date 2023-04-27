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
    <li data-h2-margin="base(0, 0, x.5, 0)">
      <ScrollToLink
        to={id}
        data-h2-color="base(black) base:hover(primary)"
        data-h2-text-decoration="base(underline) base:hover(none)"
        onScrollTo={handleScrollTo}
      >
        {children}
      </ScrollToLink>
    </li>
  );
};

export default AnchorLink;
