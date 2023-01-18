import React, { SVGAttributes } from "react";

import { NavLink, NavLinkProps } from "react-router-dom";
import sanitizeUrl from "../../helpers/sanitizeUrl";

const commonStyles = {
  "data-h2-background-color":
    "base(dt-secondary.light) base:selectors[.active](dt-secondary.lighter.10) base:focus-visible(dt-secondary.lighter.30) base:hover(dt-secondary.lighter.30)",
  "data-h2-outline": "base(none)",
  "data-h2-padding": "base(x.5, x1)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-border-bottom": "base(1px solid dt-white.10)",
  "data-h2-color": "base(dt-white)",
  "data-h2-width": "base(100%)",
  "data-h2-text-align": "base(left)",
  "data-h2-display": "base(block)",
};

interface SideMenuItemChildProps {
  icon: React.FC<SVGAttributes<SVGSVGElement>>;
  children: React.ReactNode;
}

const SideMenuItemChildren = ({ icon, children }: SideMenuItemChildProps) => {
  const Icon = icon || null;

  return (
    <div data-h2-flex-grid="base(center, x.375, 0)">
      <div data-h2-flex-item="base(content)">
        {Icon ? (
          <Icon
            data-h2-width="base(x1)"
            data-h2-display="base(inline-block)"
            data-h2-margin="base(0, x.125, 0, 0)"
            data-h2-vertical-align="base(bottom)"
          />
        ) : null}
      </div>
      <div className="side-menu__item__label" data-h2-flex-item="base(content)">
        <span
          data-h2-display="base(inline-block)"
          data-h2-min-width="base(12rem)"
        >
          {children}
        </span>
      </div>
    </div>
  );
};

export interface SideMenuItemProps
  extends SideMenuItemChildProps,
    Omit<NavLinkProps, "children" | "to"> {
  href?: string;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
  icon,
  children,
  href,
  ...rest
}: SideMenuItemProps) => {
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
