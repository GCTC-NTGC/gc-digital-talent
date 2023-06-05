/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";
import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import { SideMenuButton } from "./SideMenuItem";
import { SideMenuProvider } from "./SideMenuProvider";
import useControllableState from "../../hooks/useControllableState";

export interface SideMenuProps {
  /** Sets the section to be 'open' by default */
  defaultOpen?: boolean;
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  label: string;
  header?: React.ReactNode;
  footer?: JSX.Element;
  children?: React.ReactNode;
}

const SideMenu = ({
  defaultOpen,
  open: openProp,
  onOpenChange,
  label,
  header,
  footer,
  children,
}: SideMenuProps) => {
  const intl = useIntl();
  const [open = false, setOpen] = useControllableState<boolean>({
    controlledProp: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const isSmallScreen = useIsSmallScreen();
  const handleOpenToggle = React.useCallback(() => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen;
      return newOpen;
    });
  }, [setOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <SideMenuProvider
      open={open}
      onOpenToggle={handleOpenToggle}
      onOpenChange={setOpen}
    >
      {!isSmallScreen || open ? (
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
              className={`side-menu${open ? ` side-menu--open` : ``}`}
              lockProps={{
                "data-h2-height": "base(100%)",
              }}
            >
              <RemoveScroll
                enabled={isSmallScreen && open}
                data-h2-background-color="base:all(black.9) base:all:admin(secondary.light) base:all:iap(secondary.light)"
                data-h2-overflow="base(auto)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-height="base(100%)"
              >
                <div data-h2-margin="base(0, 0, x2, 0)">
                  <SideMenuButton onClick={handleOpenToggle} icon={Bars3Icon}>
                    {open
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
      ) : null}
    </SideMenuProvider>
  );
};

export default SideMenu;
