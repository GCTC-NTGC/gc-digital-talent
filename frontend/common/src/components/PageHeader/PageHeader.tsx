import React from "react";

import Separator from "@common/components/Separator";

import Navigation, { NavigationProps } from "./Navigation";
import PageTitle, { PageTitleProps } from "./PageTitle";

export interface PageHeaderProps extends PageTitleProps {
  navItems?: NavigationProps["items"];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  subtitle,
  children,
  navItems,
  ...rest
}) => {
  return (
    <>
      <PageTitle {...{ icon, subtitle, ...rest }}>{children}</PageTitle>
      {navItems && navItems.length ? <Navigation items={navItems} /> : null}
      <Separator
        data-h2-background-color="base(black.lightest)"
        data-h2-margin="base(x1, 0, x2, 0)"
      />
    </>
  );
};

export default PageHeader;
