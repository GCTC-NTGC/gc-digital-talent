import React from "react";
import { useLocation } from "react-router-dom";
import IconLink from "../Link/IconLink";

import { IconType } from "./types";

export interface NavItemProps {
  label: React.ReactNode;
  icon?: IconType;
  url: string;
  end?: boolean;
}

const NavItem = ({ label, icon, url, end }: NavItemProps) => {
  const { pathname } = useLocation();

  const isActive =
    pathname === url ||
    (!end && pathname.startsWith(url) && pathname.charAt(url.length) === "/");
  return (
    <IconLink
      type="button"
      href={url}
      mode="inline"
      color="primary"
      icon={icon}
      {...(isActive
        ? {
            "aria-current": "page",
            "data-h2-font-weight": "base(800)",
          }
        : {})}
    >
      {label}
    </IconLink>
  );
};

export default NavItem;
