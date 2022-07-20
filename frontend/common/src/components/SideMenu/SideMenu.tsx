/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { MenuIcon } from "@heroicons/react/outline";
import { useIntl } from "react-intl";
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
  const intl = useIntl();

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
    <div data-h2-flex-item="base(content)">
      <FocusLock
        autoFocus
        returnFocus
        disabled={!isSmallScreen}
        className={`side-menu${isOpen ? ` side-menu--open` : ``}`}
      >
        <RemoveScroll
          enabled={isSmallScreen && isOpen}
          data-h2-background-color="base(light.dt-secondary)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-height="base(100%)"
        >
          <div
            data-h2-margin="base(top-bottom, s)"
            className="side-menu__header"
          >
            <SideMenuItem as="button" onClick={handleToggle} icon={MenuIcon}>
              {isOpen
                ? intl.formatMessage({
                    defaultMessage: "Close Menu",
                  })
                : intl.formatMessage({
                    defaultMessage: "Open Menu",
                  })}
            </SideMenuItem>
            {header}
          </div>
          <nav
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            className="side-menu__content"
          >
            <div
              data-h2-margin="base(x1, 0, 0, 0) l-tablet(x2, 0, 0, 0) desktop(x3, 0, 0, 0)"
              className="side-menu__content"
            >
              {children}
            </div>
            {footer && <div className="side-menu__footer">{footer}</div>}
          </nav>
        </RemoveScroll>
      </FocusLock>
    </div>
  ) : null;
};

export default SideMenu;
