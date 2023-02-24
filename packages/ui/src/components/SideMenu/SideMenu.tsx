/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";
import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import { SideMenuButton } from "./SideMenuItem";
import "./sideMenu.css";

export interface SideMenuProps {
  isOpen: boolean;
  label: string;
  onToggle?: () => void;
  onDismiss?: () => void;
  header?: React.ReactNode;
  footer?: JSX.Element;
  children?: React.ReactNode;
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
      <div
        data-h2-position="base(sticky)"
        data-h2-location="base(0, auto, auto, auto)"
        data-h2-height="base(100vh)"
      >
        <FocusLock
          autoFocus
          returnFocus
          disabled={!isSmallScreen}
          className={`side-menu${isOpen ? ` side-menu--open` : ``}`}
        >
          <RemoveScroll
            enabled={isSmallScreen && isOpen}
            data-h2-background-color="base:all(black.9) base:all:admin(secondary.light) base:all:iap(secondary.light)"
            data-h2-overflow="base(auto)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-height="base(100%)"
          >
            <div data-h2-margin="base(0, 0, x2, 0)">
              <SideMenuButton onClick={handleToggle} icon={Bars3Icon}>
                {isOpen
                  ? intl.formatMessage(uiMessages.closeMenu)
                  : intl.formatMessage(uiMessages.openMenu)}
              </SideMenuButton>
              {header}
            </div>
            <nav
              /**
               * Ignore `no-noninteractive-element-interactions` since
               * this is captured to close the element
               */
              onKeyDown={handleKeyDown}
              aria-label={label}
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-flex-grow="base(1)"
            >
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-flex-grow="base(1)"
              >
                {children}
              </div>
              {footer && <div>{footer}</div>}
            </nav>
          </RemoveScroll>
        </FocusLock>
      </div>
    </div>
  ) : null;
};

export default SideMenu;
