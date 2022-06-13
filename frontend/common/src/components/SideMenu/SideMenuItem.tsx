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
      data-h2-width="b(100%)"
      data-h2-margin="b(x.125, auto, auto, auto)"
      data-h2-padding="b(0, x1)"
      data-h2-border="b(bottom, 1px, solid, dt-white.1)"
      data-h2-color="b(dt-white)"
      data-h2-font-size="b(h6, 1.3)"
      data-h2-font-weight="b(300)"
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
