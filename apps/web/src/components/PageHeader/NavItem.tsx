import React from "react";
import { useLocation } from "react-router-dom";

import { IconLink } from "@gc-digital-talent/ui";

import { IconType } from "./types";

export interface NavItemProps {
  label: React.ReactNode;
  icon?: IconType;
  url: string;
}

const NavItem = ({ label, icon, url }: NavItemProps) => {
  const { pathname } = useLocation();

  const isActive = pathname === url;
  return (
    <IconLink
      type="button"
      href={url}
      mode="inline"
      color="secondary"
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
