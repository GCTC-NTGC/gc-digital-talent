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
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(flex-start)"
      data-h2-background-color="base(light.dt-secondary) base:hover(lighter.dt-secondary.3)"
      data-h2-width="base(100%)"
      data-h2-padding="base(x.5, x1)"
      data-h2-cursor="base(pointer)"
      data-h2-border="base(none) base(bottom, 1px, solid, dt-white.1)"
      data-h2-color="base(dt-white)"
      className={`side-menu__item${isActive ? ` side-menu__item--active` : ``}`}
      onClick={onClick}
      {...(as === "a" ? { href } : { type: "button" })}
    >
      {Icon ? <Icon
        data-h2-width="base(x1)"
        data-h2-vertical-align="base(middle)"
        className="side-menu-item__icon" /> : null}
      <span
        data-h2-display="base(inline-block)"
        data-h2-margin="base(0, -4px, 0, x.5)">{children}</span>
    </El>
  );
};

export default SideMenuItem;
