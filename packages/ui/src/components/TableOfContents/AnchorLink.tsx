import { HTMLAttributes } from "react";

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
    <ScrollToLink
      data-is-toc-link // Used to find Table of Contents link elements in the Navigation component
      id={`toc-link-for-${id}`}
      className="inline [transition:unset] after:sr-only after:font-bold [.active]:font-bold"
      to={id}
      color="black"
      mode="text"
      onScrollTo={handleScrollTo}
    >
      {children}
    </ScrollToLink>
  );
};

export default AnchorLink;
