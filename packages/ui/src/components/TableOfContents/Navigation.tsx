import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "../Sidebar/Sidebar";

type NavigationProps = React.HTMLProps<HTMLDivElement>;

const isInView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  // top edge is in view, or bottom edge is in view, or both edges are out of view but element is partially in view
  return (
    (rect.top >= 0 && rect.top <= window.innerHeight) ||
    (rect.bottom >= 0 && rect.bottom <= window.innerHeight) ||
    (rect.top < 0 && rect.bottom > window.innerHeight)
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
    link.removeAttribute("aria-current");
    link.classList.remove("active");
  });
};

const highlightCurrentNavLink = (): void => {
  resetNavLinks();
  const currentSection = getNavSections().find(isInView);
  if (currentSection) {
    const currentLink = getNavLinkForSection(currentSection);
    if (currentLink) {
      currentLink.setAttribute("aria-current", "location");
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
