import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { LinkProps } from "./Link";

export type MenuLinkProps = Omit<LinkProps, "href"> & NavLinkProps;

const MenuLink = ({ children, ...rest }: MenuLinkProps) => {
  return (
    <NavLink
      {...rest}
      data-h2-background-color="base(transparent)"
      data-h2-color="base(black) base:hover(primary) base:iap(primary) base:iap:hover(primary.darker)"
      data-h2-border="base(none)"
      data-h2-font-size="base(normal)"
      data-h2-font-weight="base(400) base:selectors[.active](800)"
      data-h2-text-decoration="base(underline) base:hover(none)"
    >
      {children}
    </NavLink>
  );
};

export default MenuLink;
