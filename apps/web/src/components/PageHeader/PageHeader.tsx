import React from "react";

import { Separator } from "@gc-digital-talent/ui";

import Navigation from "./Navigation";
import PageTitle, { PageTitleProps } from "./PageTitle";
import { PageNavInfo } from "./types";

export interface PageHeaderProps<T> extends PageTitleProps {
  navItems?: Map<T, PageNavInfo>;
}

const PageHeader = <T,>({
  icon,
  subtitle,
  children,
  navItems,
  ...rest
}: PageHeaderProps<T>) => {
  const subNavItems = navItems
    ? Array.from(navItems.values()).map((item) => ({
        url: item.link.url,
        label: item.link.label || item.title,
        icon: item.icon,
      }))
    : [];

  return (
    <>
      <PageTitle {...{ icon, subtitle, ...rest }}>{children}</PageTitle>
      {subNavItems && subNavItems.length ? (
        <Navigation items={subNavItems} />
      ) : null}
      <Separator
        data-h2-background-color="base(black.lightest)"
        data-h2-margin="base(x1, 0, x2, 0)"
      />
    </>
  );
};

export default PageHeader;
