import React, { HTMLAttributes } from "react";
import { ScrollToLink } from "../Link";

export interface AnchorLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  id: string;
}

const AnchorLink = ({ id, children }: AnchorLinkProps) => (
  <ScrollToLink to={id} data-h2-margin="base(0, 0, x.5, 0)">
    {children}
  </ScrollToLink>
);

export default AnchorLink;
