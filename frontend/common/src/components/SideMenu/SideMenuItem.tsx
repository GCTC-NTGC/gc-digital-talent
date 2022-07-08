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
      data-h2-background-color="b(light.dt-secondary) b:hover(lighter.dt-secondary.3)"
      data-h2-width="b(100%)"
      data-h2-padding="b(x.5, x1)"
      data-h2-cursor="b(pointer)"
      data-h2-border="b(none) b(bottom, 1px, solid, dt-white.1)"
      data-h2-color="b(dt-white)"
      className={`side-menu__item${isActive ? ` side-menu__item--active` : ``}`}
      onClick={onClick}
      {...(as === "a" ? { href } : { type: "button" })}
    >
      {Icon ? <Icon
        data-h2-width="b(x1)"
        data-h2-vertical-align="b(middle)"
        className="side-menu-item__icon" /> : null}
      <span
        data-h2-display="b(inline-block)"
        data-h2-margin="b(0, -4px, 0, x.5)">{children}</span>
    </El>
  );
};

export default SideMenuItem;
