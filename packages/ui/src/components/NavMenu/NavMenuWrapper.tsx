/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import FocusLock from "react-focus-lock";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import {
  KeyboardEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
} from "react";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import useControllableState from "../../hooks/useControllableState";
import { NavMenuProvider } from "./NavMenuProvider";
import NavMenu from "./NavMenu";

interface NavMenuProps {
  /** Sets the section to be 'open' by default */
  defaultOpen?: boolean;
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the navigation region */
  label: string;
  /** Ref for the button that triggers the opening (for focus management)  */
  triggerRef?: RefObject<HTMLButtonElement>;
  /** Main menu items */
  children?: ReactNode;
  /** Reduce motion (needs to be here for context) */
  shouldReduceMotion?: boolean | null;
}

const NavMenuWrapper = ({
  defaultOpen,
  open: openProp,
  onOpenChange,
  label,
  children,
  triggerRef,
}: NavMenuProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [open = false, setOpen] = useControllableState<boolean>({
    controlledProp: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isSmallScreen = useIsSmallScreen(1080);
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
        initial: { transform: "translateY(0)" },
        animate: { transform: "translateY(0)" },
        exit: { transform: "translateY(0)" },
      };

  useEffect(() => {
    if (isSmallScreen && open) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [isSmallScreen, open]);

  return (
    <NavMenuProvider
      open={open}
      onOpenToggle={handleOpenToggle}
      onOpenChange={setOpen}
    >
      <AnimatePresence>
        {showMenu ? (
          <m.div
            transition={{ duration: 0.2, ease: "easeInOut" }}
            data-h2-flex-item="base(content)"
            data-h2-position="base(fixed) l-tablet(sticky)"
            data-h2-top="l-tablet(-1px)"
            data-h2-bottom="base(x3.5) l-tablet(auto)"
            data-h2-right="base(x.75) l-tablet(auto)"
            data-h2-left="base(x.75) l-tablet(auto)"
            data-h2-width="l-tablet(100%)"
            data-h2-z-index="base(7)"
            data-h2-overflow-y="base(auto) l-tablet(initial)"
            data-h2-max-height="base(85vh) l-tablet(none)"
            {...animConfig}
          >
            <FocusLock
              returnFocus
              disabled={!showOverlay}
              onDeactivation={() => {
                window.setTimeout(() => {
                  if (triggerRef?.current) {
                    triggerRef.current.focus();
                  }
                }, 0);
              }}
            >
              <NavMenu.Root
                /**
                 * Ignore `no-noninteractive-element-interactions` since
                 * this is captured to close the element
                 */
                onKeyDown={handleKeyDown}
                aria-label={label}
                data-state={open ? "open" : "closed"}
                data-h2-background-color="base(foreground) l-tablet:all(black.9)"
                data-h2-radius="base(rounded) l-tablet(initial)"
                data-h2-padding="base(1px 0) l-tablet(x1 0)"
              >
                <div
                  data-h2-wrapper="l-tablet(center, large, x2)"
                  data-h2-display="l-tablet(flex)"
                  data-h2-justify-content="l-tablet(space-between)"
                  data-h2-align-items="base(center)"
                >
                  {children}
                </div>
              </NavMenu.Root>
            </FocusLock>
          </m.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {showOverlay && (
          <m.div
            onClick={() => setOpen(false)}
            data-h2-position="base(fixed)"
            data-h2-location="base(0, 0, 0, 0)"
            data-h2-background-color="base:all(black.light)"
            data-h2-z-index="base(6)"
            data-h2-overflow="base(auto)"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </NavMenuProvider>
  );
};

export default NavMenuWrapper;
