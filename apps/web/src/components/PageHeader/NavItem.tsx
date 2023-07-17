import React from "react";
import { useLocation } from "react-router-dom";

import { Link, IconType } from "@gc-digital-talent/ui";

export interface NavItemProps {
  label: React.ReactNode;
  icon?: IconType;
  url: string;
}

const NavItem = ({ label, icon, url }: NavItemProps) => {
  const { pathname } = useLocation();

  const isActive = pathname === url;
  return (
    <Link
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
    </Link>
  );
};

export default NavItem;
