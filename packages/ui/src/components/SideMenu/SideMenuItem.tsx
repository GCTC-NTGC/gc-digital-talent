import { m, useReducedMotion } from "framer-motion";
import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { ReactNode, HTMLProps, forwardRef, MouseEventHandler } from "react";

import { sanitizeUrl, useIsSmallScreen } from "@gc-digital-talent/helpers";

import { IconType } from "../../types";
import { useSideMenuContext } from "./SideMenuProvider";
import { commonStyles } from "./styles";

interface SideMenuItemChildProps {
  icon: IconType;
  children: ReactNode;
}

export const SideMenuItemChildren = ({
  icon,
  children,
}: SideMenuItemChildProps) => {
  const Icon = icon || null;
  const ctx = useSideMenuContext();
  const shouldReduceMotion = useReducedMotion();

  const transitionConfig = { duration: shouldReduceMotion ? 0 : undefined };

  return (
    <m.span
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(x1 1fr)"
      transition={transitionConfig}
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
      <m.span
        transition={transitionConfig}
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
      </m.span>
    </m.span>
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

  const handleClick: MouseEventHandler = (e) => {
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

type SideMenuButtonProps = HTMLProps<HTMLButtonElement> &
  SideMenuItemChildProps;

export const SideMenuButton = forwardRef<
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
