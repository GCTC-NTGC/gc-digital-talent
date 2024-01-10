/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import { useIntl } from "react-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { uiMessages } from "@gc-digital-talent/i18n";
import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import useControllableState from "../../hooks/useControllableState";
import { SideMenuButton } from "./SideMenuItem";
import { SideMenuProvider } from "./SideMenuProvider";

export interface SideMenuProps {
  /** Sets the section to be 'open' by default */
  defaultOpen?: boolean;
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the navigation region */
  label: string;
  /** Add items to the start of the menu */
  header?: React.ReactNode;
  /** Add items to the end of the menu */
  footer?: JSX.Element;
  /** Ref for the button that triggers the opening (for focus management)  */
  triggerRef?: React.RefObject<HTMLButtonElement>;
  /** Main menu items */
  children?: React.ReactNode;
  /** Reduce motion (needs to be here for context) */
  shouldReduceMotion?: boolean | null;
}

const SideMenu = ({
  defaultOpen,
  open: openProp,
  onOpenChange,
  label,
  header,
  footer,
  children,
  triggerRef,
}: SideMenuProps) => {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
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

  const showMenu = !isSmallScreen || open;
  const showOverlay = isSmallScreen && open;

  const animConfig = shouldReduceMotion
    ? {}
    : {
        initial: { transform: "translateX(-100%)" },
        animate: { transform: "translateX(0)" },
        exit: { transform: "translateX(-100%)" },
      };

  return (
    <SideMenuProvider
      open={open}
      onOpenToggle={handleOpenToggle}
      onOpenChange={setOpen}
    >
      <AnimatePresence>
        {showMenu ? (
          <motion.div
            data-h2-flex-item="base(content)"
            data-h2-position="base(fixed) p-tablet(static)"
            data-h2-location="base(0, auto, auto, auto) p-tablet(auto)"
            data-h2-z-index="base(9999)"
            {...animConfig}
          >
            <div
              data-h2-position="base(sticky) p-tablet(sticky)"
              data-h2-location="base(0, auto, auto, auto)"
              data-h2-height="base(100vh)"
            >
              <FocusLock
                autoFocus
                returnFocus
                disabled={!showOverlay}
                className={`side-menu${open ? ` side-menu--open` : ``}`}
                lockProps={{
                  "data-h2-height": "base(100%)",
                }}
                onDeactivation={() => {
                  window.setTimeout(() => {
                    if (triggerRef?.current) {
                      triggerRef.current.focus();
                    }
                  }, 0);
                }}
              >
                <RemoveScroll
                  enabled={isSmallScreen && open}
                  data-h2-background-color="base:all(gray.darkest) base:all:iap(secondary.light)"
                  data-h2-border-right="l-tablet(1px solid black.2)"
                  data-h2-overflow-y="base(auto)"
                  data-h2-overflow-x="base(hidden)"
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
                    data-state={open ? "open" : "closed"}
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
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            data-h2-position="base(fixed)"
            data-h2-location="base(0, 0, 0, 0)"
            data-h2-background-color="base(black)"
            data-h2-z-index="base(9998)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </SideMenuProvider>
  );
};

export default SideMenu;
