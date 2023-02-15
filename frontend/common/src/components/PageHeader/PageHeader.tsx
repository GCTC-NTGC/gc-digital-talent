import React from "react";

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
    </>
  );
};

export default PageHeader;
