import AnchorLink, {
  type AnchorLinkProps as TocAnchorLinkProps,
} from "./AnchorLink";
import Content from "../Sidebar/Content";
import Heading, { type TocHeadingProps } from "./Heading";
import List, {
  ListItem,
  ListProps as TocListProps,
  ListItemProps as TocListItemProps,
} from "./List";
import Navigation from "./Navigation";
import Section, { type SectionProps as TocSectionProps } from "./Section";
import Sidebar, {
  type SidebarProps as TocSidebarProps,
} from "../Sidebar/Sidebar";
import Wrapper from "../Sidebar/Wrapper";

const TableOfContents = {
  AnchorLink,
  Content,
  Heading,
  List,
  ListItem,
  Navigation,
  Section,
  Sidebar,
  Wrapper,
};

export default TableOfContents;
export type {
  TocAnchorLinkProps,
  TocHeadingProps,
  TocSectionProps,
  TocListProps,
  TocListItemProps,
  TocSidebarProps,
};
