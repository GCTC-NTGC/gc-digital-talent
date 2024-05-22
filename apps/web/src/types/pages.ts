import { ReactNode } from "react";

import { BreadcrumbsProps, IconType } from "@gc-digital-talent/ui";

type PageNavLink = {
  label?: ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon?: IconType;
  title: string;
  subtitle?: string;
  link: PageNavLink;
  crumbs?: BreadcrumbsProps["crumbs"];
};

export type PageNavMap<K> = Map<K, PageNavInfo>;
