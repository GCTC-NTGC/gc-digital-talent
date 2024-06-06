import { HTMLAttributes } from "react";

import ScrollToLink, { ScrollLinkClickFunc } from "../Link/ScrollToLink";

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
      data-h2-font-weight="base:selectors[.active](bold) base:selectors[::after](bold)" // The Navigation component can apply the active class to bold the link to the current section.
      data-h2-visibility="base:selectors[::after](hidden)" // Stops the bolding from causing a layout shift; see https://css-tricks.com/bold-on-hover-without-the-layout-shift/
      data-h2-transition="base(unset)" // Stops transition animation between bold and normal font-weight
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
