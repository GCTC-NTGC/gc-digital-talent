import TableOfContentsNavigation from "./TableOfContents";
import TableOfContentsSection from "./TableOfContentsSection";
import type { TableOfContentsSectionProps } from "./TableOfContentsSection";

const TableOfContents = {
  Navigation: TableOfContentsNavigation,
  Section: TableOfContentsSection,
};

export default TableOfContentsNavigation;
export { TableOfContentsSection, TableOfContents };
export type { TableOfContentsSectionProps };
