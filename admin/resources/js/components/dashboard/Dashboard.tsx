import React from "react";
import { Link, useLocation } from "../../helpers/router";
import SideMenu, { MenuItem } from "../menu/SideMenu";

export const exactMatch = (ref: string, test: string): boolean => ref == test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuLink: React.FC<{
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}> = ({ href, text, title, isActive = startsWith }) => {
  const location = useLocation();
  return (
    <Link href={href} title={title ?? ""}>
      <div
        data-h2-font-weight={
          isActive(href, location.pathname) ? "b(700)" : "b(100)"
        }
      >
        {text}
      </div>
    </Link>
  );
};

export const Dashboard: React.FC = () => {
  const location = useLocation();
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <SideMenu
        items={[
          <MenuLink
            key="home"
            href="/dashboard"
            text="Home"
            isActive={exactMatch}
          />,
          <MenuLink key="users" href="/dashboard/users" text="Users" />,
          <MenuLink key="pools" href="/dashboard/pools" text="Pools" />,
        ]}
      />
    </div>
  );
};
