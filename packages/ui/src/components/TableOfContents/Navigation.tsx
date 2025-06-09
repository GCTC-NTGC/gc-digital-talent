import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";
import sortBy from "lodash/sortBy";
import { HTMLProps, useEffect } from "react";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "../Sidebar/Sidebar";

type NavigationProps = HTMLProps<HTMLDivElement>;

const isEntirelyOnScreen = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};

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

// Pick the section which will be considered the "current" section on the screen
const pickCurrentSection = (
  sections: HTMLElement[],
): HTMLElement | undefined => {
  // Check if any sections appear fully on the screen, and if so, select the one lowest on the screen
  // Otherwise, try to find the section that is in the center of the screen
  // Failing that, select the section whose edge is closest to the center
  return (
    sections.reverse().find(isEntirelyOnScreen) ?? // reverse the list to look from the bottom of the screen, and find the first fully visible section
    sortBy(sections, distanceFromCenter).at(0) // sort by distance from the center (ascending) and take the lowest
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
  const currentSection = pickCurrentSection(sections);
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

  useEffect(() => {
    highlightCurrentNavLink(); // Make sure this runs when page is first initialized
    document.addEventListener("scroll", highlightCurrentNavLink);
    return () => {
      document.removeEventListener("scroll", highlightCurrentNavLink);
    };
  }, []);

  return (
    <Sidebar className="text-left" {...rest}>
      <h2
        id={`toc-heading-${id}`}
        className="mb-6 text-lg/[1.1] font-bold lg:text-xl/[1.1]"
      >
        {intl.formatMessage(uiMessages.onThisPage)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </h2>
      <nav
        aria-labelledby={`toc-heading-${id}`}
        className="mb-18 [&>a,&>button]:text-center"
      >
        {children}
      </nav>
    </Sidebar>
  );
};

export default Navigation;
