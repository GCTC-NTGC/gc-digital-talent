import { NavLink, NavLinkProps } from "react-router";

import { LinkProps } from "./Link";

export type MenuLinkProps = Omit<LinkProps, "href"> & NavLinkProps;

const MenuLink = ({ children, ...rest }: MenuLinkProps) => {
  return (
    <NavLink
      {...rest}
      data-h2-background-color="
        base(transparent)
        base:focus-visible(focus)"
      data-h2-color="
        base(gray.darkest)
        base:hover(secondary.darker)
        base:all:focus-visible(black)

        base:selectors[.active](secondary.darker)

        base:dark:hover:iap(secondary.lightest)
        base:all:iap:focus-visible(black)
      "
      data-h2-border="base(none)"
      data-h2-font-size="base(body)"
      data-h2-font-weight="base(400) base:selectors[.active](700)"
      data-h2-text-decoration="base(underline) base:selectors[.active](none)"
      data-h2-outline="base(none)"
    >
      {children}
    </NavLink>
  );
};

export default MenuLink;
