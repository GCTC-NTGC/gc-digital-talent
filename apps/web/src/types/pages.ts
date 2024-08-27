import { ReactNode } from "react";

import { BreadcrumbsProps, IconType } from "@gc-digital-talent/ui";

interface PageNavLink {
  label?: ReactNode;
  url: string;
}

export interface PageNavInfo {
  icon?: IconType;
  title: string;
  subtitle?: string;
  link: PageNavLink;
  crumbs?: BreadcrumbsProps["crumbs"];
}

export type PageNavMap<K> = Map<K, PageNavInfo>;
