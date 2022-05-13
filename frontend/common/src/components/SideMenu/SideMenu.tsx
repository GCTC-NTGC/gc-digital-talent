import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { MenuIcon } from "@heroicons/react/outline";

import SideMenuItem from "./SideMenuItem";

import useIsSmallScreen from "../../hooks/useIsSmallScreen";

import "./sideMenu.css";

export interface SideMenuProps {
  isOpen: boolean;
  label: string;
  onToggle?: () => void;
  header?: React.ReactNode;
  footer?: JSX.Element;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  label,
  onToggle,
  header,
  footer,
  children,
}) => {
  const isSmallScreen = useIsSmallScreen();
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };
  return !isSmallScreen || isOpen ? (
    <FocusLock
      autoFocus
      returnFocus
      disabled={!isSmallScreen}
      className={`side-menu${isOpen ? ` side-menu--open` : ``}`}
    >
      <RemoveScroll
        enabled={isSmallScreen && isOpen}
        data-h2-padding="b(all, xs)"
        data-h2-overflow="b(y, auto)"
        data-h2-bg-color="b(lightnavy)"
        data-h2-shadow="m(m)"
        data-h2-position="b(fixed)"
        data-h2-width="b(100)"
      >
        <nav
          aria-label={label}
          className="side-menu__inner"
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(column)"
          data-h2-align-items="b(stretch)"
          data-h2-justify-content="b(space-between)"
        >
          <div data-h2-margin="(top-bottom, s)" className="side-menu__header">
            <SideMenuItem as="button" onClick={handleToggle} icon={MenuIcon}>
              {isOpen ? "Close" : "Open"} Menu
            </SideMenuItem>
            {header}
          </div>
          <div
            data-h2-margin="b(top, m) m(top, l) l(top, xl)"
            className="side-menu__content"
          >
            {children}
          </div>
          {footer && (
            <div data-h2-margin="(top-bottom, s)" className="side-menu__footer">
              {footer}
            </div>
          )}
        </nav>
      </RemoveScroll>
    </FocusLock>
  ) : null;
};

export default SideMenu;
