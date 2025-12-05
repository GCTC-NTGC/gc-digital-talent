import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Color, HeadingRank, IconType, IconProps } from "./types";
import Accordion, {
  type AccordionMetaData,
} from "./components/Accordion/Accordion";
import Alert, { type AlertProps } from "./components/Alert/Alert";
import AlertDialog from "./components/AlertDialog";
import Announcer, { useAnnouncer } from "./components/Announcer/Announcer";
import Button, { type ButtonProps } from "./components/Button";
import Counter from "./components/Button/Counter";
import Breadcrumbs, {
  type BreadcrumbsProps,
} from "./components/Breadcrumbs/Breadcrumbs";
import { Container } from "./components/Container/Container";
import Crumb from "./components/Breadcrumbs/Crumb";
import CTAButton, { CTAButtonProps } from "./components/CallToAction/CTAButton";
import CTALink, { CTALinkProps } from "./components/CallToAction/CTALink";
import Card, { type CardProps } from "./components/Card/Card";
import CardFlat, { CardFlatProps } from "./components/Card/CardFlat/CardFlat";
import CardRepeater, {
  useCardRepeaterContext,
} from "./components/CardRepeater/CardRepeater";
import CardSeparator from "./components/CardSeparator";
import Chip, { type ChipProps } from "./components/Chip/Chip";
import Chips from "./components/Chip/Chips";
import Collapsible from "./components/Collapsible";
import DescriptionList from "./components/DescriptionList/DescriptionList";
import Dialog from "./components/Dialog/Dialog";
import DropdownMenu from "./components/DropdownMenu/DropdownMenu";
import Flourish from "./components/Flourish/Flourish";
import Heading, {
  HeadingProps,
  HeadingLevel,
  HeadingRef,
} from "./components/Heading";
import IconButton, {
  type IconButtonProps,
} from "./components/Button/IconButton";
import IconLink, { type IconLinkProps } from "./components/Link/IconLink";
import Image, { type ImgProps } from "./components/Image/Image";
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
import Ol from "./components/List/Ol";
import Ul from "./components/List/Ul";
import Loading, { type LoadingProps } from "./components/Loading";
import Metadata, { MetadataItemProps } from "./components/Metadata/Metadata";
import NavMenu from "./components/NavMenu/NavMenu";
import NavMenuProvider from "./components/NavMenu/NavMenuProvider";
import NavTabs from "./components/Tabs/NavTabs";
import NotFound, { ThrowNotFound } from "./components/NotFound";
import Notice, { type NoticeProps } from "./components/Notice/Notice";
import Pending, {
  type PendingProps,
  LoadingErrorMessage,
} from "./components/Pending";
import PreviewList, {
  type MetaDataProps as PreviewMetaData,
} from "./components/PreviewList/PreviewList";
import ResourceBlock from "./components/ResourceBlock";
import Separator, {
  type SeparatorProps,
} from "./components/Separator/Separator";
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
import Tabs from "./components/Tabs/Tabs";
import ToggleGroup from "./components/ToggleGroup/ToggleGroup";
import ToggleSection from "./components/ToggleSection/ToggleSection";
import TreeView from "./components/TreeView/TreeView";
import {
  incrementHeadingRank,
  decrementHeadingRank,
  hrefToString,
} from "./utils";
import { UNICODE_CHAR, wrapParens } from "./utils/unicode";
import useControllableState from "./hooks/useControllableState";
import TaskCard from "./components/TaskCard/TaskCard";

export type {
  Color,
  HeadingRank,
  AccordionMetaData,
  AlertProps,
  BreadcrumbsProps,
  ButtonProps,
  CardFlatProps,
  CardProps,
  CTAButtonProps,
  CTALinkProps,
  HeadingProps,
  HeadingLevel,
  HeadingRef,
  DownloadCsvProps,
  LinkProps,
  IconProps,
  IconButtonProps,
  IconLinkProps,
  IconType,
  ScrollToLinkProps,
  ScrollLinkClickFunc,
  ImgProps,
  MenuLinkProps,
  MetadataItemProps,
  LoadingProps,
  NoticeProps,
  PendingProps,
  PreviewMetaData,
  ChipProps,
  SeparatorProps,
  SidebarProps,
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
};

export {
  Accordion,
  Alert,
  AlertDialog,
  Announcer,
  useAnnouncer,
  Breadcrumbs,
  Crumb,
  Button,
  Card,
  CardFlat,
  CardRepeater,
  CardSeparator,
  Chips,
  Chip,
  Collapsible,
  Container,
  Counter,
  CTALink,
  CTAButton,
  DescriptionList,
  Dialog,
  /* Re-exporting primitive for custom solutions */
  DialogPrimitive,
  DropdownMenu,
  Flourish,
  Heading,
  IconButton,
  IconLink,
  Image,
  Link,
  DownloadCsv,
  ScrollToLink,
  MenuLink,
  Metadata,
  NavMenu,
  NavMenuProvider,
  NavTabs,
  Notice,
  Ol,
  Ul,
  Loading,
  LoadingErrorMessage,
  Pending,
  PreviewList,
  ResourceBlock,
  NotFound,
  ThrowNotFound,
  Separator,
  Sidebar,
  Spoiler,
  Stepper,
  Switch,
  TableOfContents,
  Tabs,
  TaskCard,
  ToggleGroup,
  ToggleSection,
  TreeView,
};

export {
  incrementHeadingRank,
  decrementHeadingRank,
  useCardRepeaterContext,
  useControllableState,
  hrefToString,
  wrapParens,
  UNICODE_CHAR,
};
