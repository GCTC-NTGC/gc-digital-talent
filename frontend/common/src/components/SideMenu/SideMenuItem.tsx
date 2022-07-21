import sanitizeUrl from "@common/helpers/sanitizeUrl";
import React, { MouseEventHandler, ReactType } from "react";
import useLinkClickHandler from "../Link/useLinkClickHandler";

export interface SideMenuItemProps {
  as?: "a" | "button";
  icon: React.FC<{ className?: string }>;
  isActive?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement>;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
  as = "a",
  icon,
  children,
  isActive,
  onClick,
  href,
}) => {
  const El = as;
  const Icon = icon || null;
  const url = sanitizeUrl(href);
  const clickHandler = useLinkClickHandler({
    to: url || "#",
  });

  return (
    <El
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(flex-start)"
      data-h2-width="b(100)"
      data-h2-margin="b(top, xxs)"
      data-h2-padding="b(left-right, m)"
      data-h2-border="b(white[.1], bottom, solid, s)"
      data-h2-font-color="b(white)"
      data-h2-font-size="b(h6)"
      data-h2-font-weight="b(300)"
      className={`side-menu__item${isActive ? ` side-menu__item--active` : ``}`}
      onClick={(e) => {
        if (as === "a") {
          clickHandler(e as React.MouseEvent<HTMLAnchorElement>);
        } else if (onClick) {
          onClick(e as React.MouseEvent<HTMLButtonElement>);
        }
      }}
      {...(as === "a" ? { href } : { type: "button" })}
    >
      {Icon ? <Icon className="side-menu-item__icon" /> : null}
      <span>{children}</span>
    </El>
  );
};

export default SideMenuItem;
