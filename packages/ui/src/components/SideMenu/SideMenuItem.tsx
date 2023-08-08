import React, { ReactPropTypes } from "react";
import { motion } from "framer-motion";
import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";

import { sanitizeUrl, useIsSmallScreen } from "@gc-digital-talent/helpers";

import { IconType } from "../../types";
import { useSideMenuContext } from "./SideMenuProvider";

const commonStyles = {
  "data-h2-background-color":
    "base(transparent) base:selectors[.active](secondary.darker) base:focus-visible(focus) base:hover(secondary.darker) base:admin(secondary.light) base:admin:selectors[.active](secondary.lighter.10) base:admin:focus-visible(focus) base:admin:hover(secondary.lighter.30) base:iap(secondary.light) base:iap:selectors[.active](secondary.lighter.10) base:iap:focus-visible(focus) base:iap:hover(secondary.lighter.30)",
  "data-h2-outline": "base(none)",
  "data-h2-padding": "base(x.5, x1)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-border-bottom": "base(1px solid white.10)",
  "data-h2-color":
    "base(white) base:all:focus-visible(black) base:all:admin:focus-visible(black) base:all:iap:focus-visible(black)",
  "data-h2-width": "base(100%)",
  "data-h2-text-align": "base(left)",
  "data-h2-display": "base(block)",
};

interface SideMenuItemChildProps {
  icon: IconType;
  children: React.ReactNode;
}

const SideMenuItemChildren = ({ icon, children }: SideMenuItemChildProps) => {
  const Icon = icon || null;
  const ctx = useSideMenuContext();

  return (
    <motion.span
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(x1 1fr)"
      animate={
        ctx?.open
          ? {
              columnGap: "0.75rem",
            }
          : {
              columnGap: "0rem",
            }
      }
    >
      <span>
        {Icon ? (
          <Icon
            data-h2-width="base(x1)"
            data-h2-display="base(inline-block)"
            data-h2-vertical-align="base(bottom)"
          />
        ) : null}
      </span>
      <motion.span
        animate={
          ctx?.open
            ? {
                opacity: 1,
                width: "auto",
              }
            : {
                width: 0,
                opacity: 0,
              }
        }
      >
        <span
          data-h2-display="base(inline-block)"
          data-h2-min-width="base(12rem)"
        >
          {children}
        </span>
      </motion.span>
    </motion.span>
  );
};

export interface SideMenuItemProps
  extends SideMenuItemChildProps,
    Omit<NavLinkProps, "children" | "to"> {
  href?: string;
}

const SideMenuItem = ({ icon, children, href, ...rest }: SideMenuItemProps) => {
  const url = sanitizeUrl(href);
  const navigate = useNavigate();
  const ctx = useSideMenuContext();
  const isSmallScreen = useIsSmallScreen();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (isSmallScreen && ctx?.onOpenChange) {
      ctx?.onOpenChange(false);
    }
    navigate(url || "");
  };

  return (
    <NavLink
      to={url || "#"}
      className="side-menu__item"
      onClick={handleClick}
      {...commonStyles}
      {...rest}
    >
      <SideMenuItemChildren icon={icon}>{children}</SideMenuItemChildren>
    </NavLink>
  );
};

export const ExternalSideMenuItem = ({
  icon,
  children,
  href,
}: Omit<SideMenuItemProps, "onClick" | "isActive">) => {
  const url = sanitizeUrl(href);

  return (
    // NOTE: We do want to allow external links to be rendered as <a> tags
    // eslint-disable-next-line react/forbid-elements
    <a className="side-menu__item" {...commonStyles} href={url}>
      <SideMenuItemChildren icon={icon}>{children}</SideMenuItemChildren>
    </a>
  );
};

type SideMenuButtonProps = React.HTMLProps<HTMLButtonElement> &
  SideMenuItemChildProps;

export const SideMenuButton = React.forwardRef<
  HTMLButtonElement,
  SideMenuButtonProps
>(({ icon, children, ...rest }, forwardedRef) => (
  <button
    ref={forwardedRef}
    className="side-menu__item"
    {...commonStyles}
    {...rest}
    type="button"
  >
    <SideMenuItemChildren icon={icon}>{children}</SideMenuItemChildren>
  </button>
));

export default SideMenuItem;
