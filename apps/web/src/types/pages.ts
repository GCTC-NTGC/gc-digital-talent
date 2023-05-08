import React from "react";

import { BreadcrumbsProps } from "@gc-digital-talent/ui";
import { GetApplicationStepInfoArgs } from "./applicationStep";

type PageNavLink = {
  label?: React.ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
  link: PageNavLink;
  crumbs?: BreadcrumbsProps["crumbs"];
};

export type PageNavMap<K> = Map<K, PageNavInfo>;

export type GetPageNavInfo = (args: GetApplicationStepInfoArgs) => PageNavInfo;
