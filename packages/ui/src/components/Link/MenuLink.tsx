import { NavLink, NavLinkProps } from "react-router";
import { tv } from "tailwind-variants";

import { LinkProps } from "./Link";

const navLink = tv({
  base: "focus-visible:focus border-none bg-transparent text-base outline-none hover:text-secondary-600 focus-visible:text-black iap:dark:hover:text-secondary-100",
  variants: {
    isActive: {
      true: "font-bold text-secondary-600 dark:text-secondary-100",
      false: "text-gray-700 underline dark:text-gray-100",
    },
  },
});

export interface MenuLinkProps
  extends Omit<LinkProps, "href" | "to">,
    Pick<NavLinkProps, "end" | "caseSensitive" | "to"> {}

const MenuLink = ({ children, ...rest }: MenuLinkProps) => {
  return (
    <NavLink {...rest} className={({ isActive }) => navLink({ isActive })}>
      {children}
    </NavLink>
  );
};

export default MenuLink;
