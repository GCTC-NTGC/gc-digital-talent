import { NavLink, NavLinkProps } from "react-router-dom";

import { LinkProps } from "@gc-digital-talent/ui";

type MenuLinkProps = Omit<LinkProps, "href"> & NavLinkProps;

const MenuLink = ({ children, ...rest }: MenuLinkProps) => {
  return (
    <NavLink
      {...rest}
      data-h2-color="
        base(white)
        base:dark(gray.lightest)
        base:dark:hover(secondary.lightest)
        base:iap(white)
        base:iap:hover(primary.lightest)
        base:iap:selectors[.active](primary.lighter)
        base:iap:dark(gray.lightest)
        base:iap:dark:hover(primary.lightest)
        base:iap:dark:selectors[.active](primary.lighter)
        base:hover(secondary.lighter)
        base:selectors[.active](secondary)
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
