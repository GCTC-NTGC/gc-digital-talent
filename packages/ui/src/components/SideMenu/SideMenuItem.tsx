import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

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
    <span
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(x1 1fr)"
      data-h2-gap="base(x.5)"
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
      <span
        {...(ctx?.open
          ? { "data-h2-visually-hidden": "base(invisible)" }
          : {
              "data-h2-position": "base(relative)",
              "data-h2-left": "base(auto)",
              "data-h2-right": "base(auto)",
              "data-h2-width": "base(auto)",
            })}
      >
        <span
          data-h2-display="base(inline-block)"
          data-h2-min-width="base(12rem)"
        >
          {children}
        </span>
      </span>
    </span>
  );
};

export interface SideMenuItemProps
  extends SideMenuItemChildProps,
    Omit<NavLinkProps, "children" | "to"> {
  href?: string;
}

const SideMenuItem = ({ icon, children, href, ...rest }: SideMenuItemProps) => {
  const url = sanitizeUrl(href);

  return (
    <NavLink
      to={url || "#"}
      className="side-menu__item"
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
