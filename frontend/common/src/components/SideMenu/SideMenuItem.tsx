import React, { MouseEventHandler } from "react";

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
      className={`side-menu__item${isActive ? ` side-menu__item--active` : ``}`}
      onClick={onClick}
      {...(as === "a" ? { href } : { type: "button" })}
    >
      {Icon ? <Icon className="side-menu-item__icon" /> : null}
      <span>{children}</span>
    </El>
  );
};

export default SideMenuItem;
