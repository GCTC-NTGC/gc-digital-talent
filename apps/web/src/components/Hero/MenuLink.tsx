import { NavLink, NavLinkProps } from "react-router-dom";

import { LinkProps } from "@gc-digital-talent/ui";

export type MenuLinkProps = Omit<LinkProps, "href"> & NavLinkProps;

const MenuLink = ({ children, ...rest }: MenuLinkProps) => {
  return (
    <NavLink
      {...rest}
      data-h2-background-color="
        base(transparent)
        base:focus-visible(focus)"
      data-h2-color="
        base(white)
        base:hover(secondary.lighter)
        base:all:focus-visible(black)
        base:selectors[.active](secondary)
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
