import React from "react";

import NavItem, { NavItemProps } from "./NavItem";

export interface NavigationProps {
  items: Array<NavItemProps>;
}

const Navigation = ({ items }: NavigationProps) => (
  <div
    data-h2-margin="base(x1 0)"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-gap="base(x.25)"
  >
    {items.map((itemProps) => (
      <NavItem key={itemProps.url} {...itemProps} />
    ))}
  </div>
);

export default Navigation;
