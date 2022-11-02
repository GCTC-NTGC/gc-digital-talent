import React, { MouseEventHandler, SVGAttributes } from "react";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import useLinkClickHandler from "../Link/useLinkClickHandler";

const commonStyles = {
  "data-h2-background-color":
    "base(light.dt-secondary) base:focus-visible(lighter.dt-secondary.30) base:hover(lighter.dt-secondary.30)",
  "data-h2-outline": "base(none)",
  "data-h2-padding": "base(x.5, x1)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-border": "base(bottom, 1px, solid, dt-white.10)",
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
export interface SideMenuItemProps extends SideMenuItemChildProps {
  as?: "a" | "button";
  isActive?: boolean;
  href?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement>;
}

const SideMenuItem = ({
  as = "a",
  external = false,
  icon,
  children,
  isActive,
  onClick,
  href,
}: SideMenuItemProps) => {
  const El = as;
  const url = sanitizeUrl(href);
  const clickHandler = useLinkClickHandler({
    to: url || "#",
  });

  return (
    <El
      className={`side-menu__item${isActive ? ` side-menu__item--active` : ``}`}
      {...commonStyles}
      onClick={(e) => {
        if (external) return;
        if (as === "a" && !onClick) {
          clickHandler(e as React.MouseEvent<HTMLAnchorElement>);
        } else if (onClick) {
          onClick(e as React.MouseEvent<HTMLButtonElement>);
        }
      }}
      {...(as === "a" ? { href } : { type: "button" })}
    >
      <SideMenuItemChildren icon={icon}>{children}</SideMenuItemChildren>
    </El>
  );
};

type SideMenuButtonProps = React.HTMLProps<HTMLButtonElement> &
  SideMenuItemChildProps;

export const SideMenuButton = React.forwardRef<
  HTMLButtonElement,
  SideMenuButtonProps
>(({ icon, children, ...rest }, forwardedRef) => (
  <button ref={forwardedRef} {...commonStyles} {...rest} type="button">
    <SideMenuItemChildren icon={icon}>{children}</SideMenuItemChildren>
  </button>
));

export default SideMenuItem;
