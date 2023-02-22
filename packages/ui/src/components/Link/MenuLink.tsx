import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

import useCommonLinkStyles from "./useCommonLinkStyles";
import { LinkProps } from "./Link";

export type MenuLinkProps = Omit<LinkProps, "href"> & NavLinkProps;

const MenuLink = ({
  color = "primary",
  weight,
  disabled,
  mode = "solid",
  block = false,
  type = "link",
  children,
  ...rest
}: MenuLinkProps) => {
  const styles = useCommonLinkStyles({
    color,
    mode,
    block,
    disabled,
    type,
    weight,
  });

  return (
    <NavLink
      {...styles}
      {...rest}
      data-h2-background-color="base(transparent)"
      data-h2-color="base(primary)"
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
