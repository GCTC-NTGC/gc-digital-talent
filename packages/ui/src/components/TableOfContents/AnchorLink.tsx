import React, { HTMLAttributes } from "react";
import { ScrollToLink } from "../Link";

export interface AnchorLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  id: string;
}

const AnchorLink = ({ id, children }: AnchorLinkProps) => (
  <li data-h2-margin="base(0, 0, x.5, 0)">
    <ScrollToLink
      data-h2-color="base(black) base:hover(primary)"
      data-h2-text-decoration="base(underline) base:hover(none)"
      to={id}
    >
      {children}
    </ScrollToLink>
  </li>
);

export default AnchorLink;
