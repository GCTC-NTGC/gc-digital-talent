import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "../Sidebar/Sidebar";

type NavigationProps = React.HTMLProps<HTMLDivElement>;

// Returns true if the element is at all visible, in whole or in part, on the screen
const isPartlyInView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  // top edge is in view, or bottom edge is in view, or both edges are out of view but element is partially in view
  return (
    (rect.top >= 0 && rect.top <= window.innerHeight) ||
    (rect.bottom >= 0 && rect.bottom <= window.innerHeight) ||
    (rect.top < 0 && rect.bottom > window.innerHeight)
  );
};

// Returns true if the element is visible on the screen and covers the halfway point (vertically)
const isCentrallyInView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
  );
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
  // Try to find the section that is in the center of the screen, and failing that, the first partly visible section on the screen.
  const currentSection =
    sections.find(isCentrallyInView) ?? sections.find(isPartlyInView);
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
