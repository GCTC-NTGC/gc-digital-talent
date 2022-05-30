import AnchorLink, {
  type AnchorLinkProps as TocAnchorLinkProps,
} from "./AnchorLink";
import Content from "./Content";
import Heading, { type HeadingProps as TocHeadingProps } from "./Heading";
import Navigation from "./Navigation";
import Section, { type SectionProps as TocSectionProps } from "./Section";
import Wrapper from "./Wrapper";

const TableOfContents = {
  AnchorLink,
  Content,
  Heading,
  Navigation,
  Section,
  Wrapper,
};

export default TableOfContents;
export type { TocAnchorLinkProps, TocHeadingProps, TocSectionProps };
