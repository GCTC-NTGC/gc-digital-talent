/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  KeyboardEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  JSX,
} from "react";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import useControllableState from "../../hooks/useControllableState";
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
  /** Add items to the end of the menu */
  footer?: JSX.Element;
  /** Ref for the button that triggers the opening (for focus management)  */
  triggerRef?: RefObject<HTMLButtonElement>;
  /** Main menu items */
  children?: ReactNode;
  /** Reduce motion (needs to be here for context) */
  shouldReduceMotion?: boolean | null;
}

const SideMenu = ({
  defaultOpen,
  open: openProp,
  onOpenChange,
  label,
  footer,
  children,
  triggerRef,
}: SideMenuProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [open = false, setOpen] = useControllableState<boolean>({
    controlledProp: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isSmallScreen = useIsSmallScreen();
  const handleOpenToggle = useCallback(() => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen;
      return newOpen;
    });
  }, [setOpen]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
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
          <m.div
            data-h2-flex-item="base(content)"
            data-h2-position="base(fixed) p-tablet(static)"
            data-h2-location="base(0, auto, auto, auto) p-tablet(auto)"
            data-h2-z-index="base(9999) p-tablet(1)"
            {...animConfig}
          >
            <div
              data-h2-position="base(sticky) p-tablet(sticky)"
              data-h2-location="base(0, auto, auto, auto)"
              data-h2-height="base(100vh)"
            >
              <FocusLock
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
                      data-h2-padding="base(x1.5)"
                      data-h2-flex-direction="base(column)"
                      data-h2-align-items="base(flex-start)"
                      data-h2-gap="base(x2)"
                    >
                      <div
                        data-h2-display="base(flex)"
                        data-h2-flex-direction="base(column)"
                        data-h2-align-items="base(flex-start)"
                        data-h2-gap="base(x1.5)"
                      >
                        {children}
                      </div>

                      {footer && <div>{footer}</div>}
                    </div>
                  </nav>
                </RemoveScroll>
              </FocusLock>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {showOverlay && (
          <m.div
            onClick={() => setOpen(false)}
            data-h2-position="base(fixed)"
            data-h2-location="base(0, 0, 0, 0)"
            data-h2-background-color="base:all(black)"
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
