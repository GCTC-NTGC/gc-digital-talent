import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  Color,
  HeadingRank,
  IconType,
  IconProps,
  ButtonLinkMode,
} from "./types";
import Accordion from "./components/Accordion";
import Alert, { type AlertProps } from "./components/Alert";
import AlertDialog from "./components/AlertDialog";
import Announcer, { useAnnouncer } from "./components/Announcer/Announcer";
import Button, { type ButtonProps } from "./components/Button";
import Counter from "./components/Button/Counter";
import Breadcrumbs, { type BreadcrumbsProps } from "./components/Breadcrumbs";
import Board from "./components/Board/Board";
import {
  CardBasic,
  CardFlat,
  type CardBasicProps,
  type CardFlatProps,
} from "./components/Card";
import CardRepeater, {
  useCardRepeaterContext,
} from "./components/CardRepeater/CardRepeater";
import Chip, { type ChipProps } from "./components/Chip/Chip";
import Chips from "./components/Chip/Chips";
import Collapsible from "./components/Collapsible";
import DescriptionList from "./components/DescriptionList/DescriptionList";
import Dialog from "./components/Dialog";
import DropdownMenu from "./components/DropdownMenu";
import Flourish from "./components/Flourish";
import Heading, {
  HeadingProps,
  HeadingLevel,
  HeadingRef,
} from "./components/Heading";
import { headingStyles } from "./components/Heading/styles";
import Link, {
  DownloadCsv,
  ScrollToLink,
  MenuLink,
  type DownloadCsvProps,
  type LinkProps,
  type ScrollToLinkProps,
  type ScrollLinkClickFunc,
  type MenuLinkProps,
} from "./components/Link";
import Loading, { type LoadingProps } from "./components/Loading";
import NavTabs from "./components/Tabs/NavTabs";
import NotFound, { ThrowNotFound } from "./components/NotFound";
import Pending, {
  type PendingProps,
  LoadingErrorMessage,
} from "./components/Pending";
import ScrollArea from "./components/ScrollArea";
import Separator from "./components/Separator";
import SideMenu, {
  ExternalSideMenuItem,
  SideMenuButton,
  SideMenuItem,
  SideMenuContentWrapper,
  SideMenuCategory,
  SideMenuItemChildren,
  commonStyles,
  type SideMenuProps,
  type SideMenuItemProps,
} from "./components/SideMenu";
import Sidebar, { SidebarProps } from "./components/Sidebar";
import Spoiler, { SpoilerProps } from "./components/Spoiler/Spoiler";
import Stepper, { StepperProps } from "./components/Stepper/Stepper";
import { StepType } from "./components/Stepper/types";
import Switch, { SwitchProps } from "./components/Switch/Switch";
import TableOfContents, {
  type TocAnchorLinkProps,
  TocHeadingProps,
  TocSectionProps,
  TocListItemProps,
  TocListProps,
  TocSidebarProps,
} from "./components/TableOfContents";
import Tabs from "./components/Tabs";
import ToggleGroup from "./components/ToggleGroup";
import ToggleSection from "./components/ToggleSection/ToggleSection";
import TreeView from "./components/TreeView";
import Well, { WellProps } from "./components/Well";
import { incrementHeadingRank, decrementHeadingRank } from "./utils";
import useControllableState from "./hooks/useControllableState";
import TaskCard from "./components/TaskCard";

export type {
  Color,
  HeadingRank,
  AlertProps,
  BreadcrumbsProps,
  ButtonProps,
  ButtonLinkMode,
  CardFlatProps,
  CardBasicProps,
  HeadingProps,
  HeadingLevel,
  HeadingRef,
  DownloadCsvProps,
  LinkProps,
  IconProps,
  IconType,
  ScrollToLinkProps,
  ScrollLinkClickFunc,
  MenuLinkProps,
  LoadingProps,
  PendingProps,
  ChipProps,
  SidebarProps,
  SideMenuProps,
  SideMenuItemProps,
  SpoilerProps,
  StepperProps,
  StepType,
  SwitchProps,
  TocAnchorLinkProps,
  TocHeadingProps,
  TocSectionProps,
  TocListItemProps,
  TocListProps,
  TocSidebarProps,
  WellProps,
};

export {
  Accordion,
  Alert,
  AlertDialog,
  Announcer,
  useAnnouncer,
  Board,
  Breadcrumbs,
  Button,
  CardBasic,
  CardFlat,
  CardRepeater,
  Chips,
  Chip,
  Collapsible,
  Counter,
  DescriptionList,
  Dialog,
  /* Re-exporting primitive for custom solutions */
  DialogPrimitive,
  DropdownMenu,
  Flourish,
  Heading,
  Link,
  DownloadCsv,
  ScrollToLink,
  MenuLink,
  NavTabs,
  Loading,
  LoadingErrorMessage,
  Pending,
  NotFound,
  ThrowNotFound,
  ScrollArea,
  Separator,
  SideMenu,
  ExternalSideMenuItem,
  Sidebar,
  SideMenuButton,
  SideMenuItem,
  SideMenuCategory,
  SideMenuContentWrapper,
  SideMenuItemChildren,
  commonStyles,
  Spoiler,
  Stepper,
  Switch,
  TableOfContents,
  Tabs,
  TaskCard,
  ToggleGroup,
  ToggleSection,
  TreeView,
  Well,
};

export {
  incrementHeadingRank,
  decrementHeadingRank,
  headingStyles,
  useCardRepeaterContext,
  useControllableState,
};
