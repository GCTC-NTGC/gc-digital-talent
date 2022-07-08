/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
  onDismiss?: () => void;
  header?: React.ReactNode;
  footer?: JSX.Element;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  label,
  onToggle,
  onDismiss,
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (onDismiss) {
        onDismiss();
      }
    }
  };

  return !isSmallScreen || isOpen ? (
    <div data-h2-flex-item="b(content)">
      <FocusLock
        autoFocus
        returnFocus
        disabled={!isSmallScreen}
        className={`side-menu${isOpen ? ` side-menu--open` : ``}`}
      >
        <RemoveScroll
          enabled={isSmallScreen && isOpen}
          data-h2-background-color="b(light.dt-secondary)"
          data-h2-height="b(100%)"
        >
          <nav
            /**
             * Ignore `no-noninteractive-element-interactions` since
             * this is captured to close the element
             */
            onKeyDown={handleKeyDown}
            aria-label={label}
            className="side-menu__inner"
            data-h2-height="b(100%)"
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column)"
          >
            <div className="side-menu__header">
              <SideMenuItem as="button" onClick={handleToggle} icon={MenuIcon}>
                {isOpen ? "Close" : "Open"} Menu
              </SideMenuItem>
              {header}
            </div>
            <div
              data-h2-margin="b(x1, 0, 0, 0) m(x2, 0, 0, 0) l(x3, 0, 0, 0)"
              className="side-menu__content"
            >
              {children}
            </div>
            {footer && (
              <div className="side-menu__footer">
                {footer}
              </div>
            )}
          </nav>
        </RemoveScroll>
      </FocusLock>
    </div>
  ) : null;
};

export default SideMenu;
