import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";
import sortBy from "lodash/sortBy";
import head from "lodash/head";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "../Sidebar/Sidebar";

type NavigationProps = React.HTMLProps<HTMLDivElement>;

const distanceFromCenter = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const center = window.innerHeight / 2;
  // If the top and bottom are on either side of the center, this element covers the center of the screen
  if (rect.top <= center && rect.bottom >= center) {
    return 0;
  }
  // Otherwise, return the minimum of the distance from the center to the top or bottom of the element
  return Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
};

const getNavSections = (): HTMLElement[] =>
  Array.from(document.querySelectorAll("[data-is-toc-section]"));

const getNavLinks = (): HTMLAnchorElement[] =>
  Array.from(document.querySelectorAll("[data-is-toc-link]"));

const getNavLinkForSection = (section: HTMLElement): HTMLAnchorElement | null =>
  document.querySelector(`#toc-link-for-${section.id}`);

const resetNavLinks = (): void => {
  getNavLinks().forEach((link) => {
    link.classList.remove("active");
  });
};

const highlightCurrentNavLink = (): void => {
  resetNavLinks();
  const sections = getNavSections();
  // Try to find the section that is in the center of the screen, and failing that, the one whose edge is closest to the center
  const currentSection = head(sortBy(sections, distanceFromCenter)); // sort by distance from the center (ascending) and take the lowest
  if (currentSection) {
    const currentLink = getNavLinkForSection(currentSection);
    if (currentLink) {
      currentLink.classList.add("active");
    }
  }
};

const Navigation = ({ children, ...rest }: NavigationProps) => {
  const intl = useIntl();
  const id = uniqueId();

  const textAlignStyles = {
    "data-h2-text-align": "base(left)",
  };

  React.useEffect(() => {
    highlightCurrentNavLink(); // Make sure this runs when page is first initialized
    document.addEventListener("scroll", highlightCurrentNavLink);
    return () => {
      document.removeEventListener("scroll", highlightCurrentNavLink);
    };
  }, []);

  return (
    <Sidebar {...textAlignStyles} {...rest}>
      <h2
        id={`toc-heading-${id}`}
        data-h2-font-size="base(h6, 1)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(uiMessages.onThisPage)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </h2>
      <nav
        aria-labelledby={`toc-heading-${id}`}
        data-h2-text-align="base:children[>button, >a](center)"
        data-h2-margin-bottom="base(x3)"
      >
        {children}
      </nav>
    </Sidebar>
  );
};

export default Navigation;
