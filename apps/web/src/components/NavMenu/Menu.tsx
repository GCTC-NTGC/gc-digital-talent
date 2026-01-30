/* eslint-disable react/forbid-elements */
import { FocusOn } from "react-focus-on";
import { m, AnimatePresence } from "motion/react";
import {
  useEffect,
  useState,
  KeyboardEventHandler,
  useRef,
  ReactNode,
  ReactElement,
} from "react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import {
  getLocale,
  localizePath,
  navigationMessages,
  oppositeLocale,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  Button,
  NavMenu as NavMenu,
  NavMenuProvider,
  Container,
} from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import NotificationDialog from "../NotificationDialog/NotificationDialog";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import NavItem from "./MenuItem";
import MenuSeparator from "./MenuSeparator";

export const borderItem = tv({
  base: "sm:flex",
  variants: {
    borderLeft: {
      true: "before:hidden before:h-6 before:w-px before:self-center before:bg-black/20 sm:before:block before:sm:bg-white/20 before:dark:bg-white/20",
    },
    borderRight: {
      true: "after:hidden after:h-6 after:w-px after:self-center after:bg-black/20 sm:after:block after:sm:bg-white/20 after:dark:bg-white/20",
    },
  },
});

type NavItemProps = React.ComponentProps<typeof NavMenu.Item>;

interface MenuProps {
  children: ReactNode;
  label?: string;
  homeLink?: {
    href?: string;
    label?: string;
  };
  accountLinks?:
    | ReactElement<NavItemProps>
    | ReactElement<NavItemProps>[]
    | null;
  authParams?: string;
}

const Menu = ({
  children,
  label,
  homeLink,
  accountLinks,
  authParams,
}: MenuProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const isSmallScreen = useIsSmallScreen("sm");
  const homeLinkRef = useRef<HTMLAnchorElement>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const { loggedIn } = useAuthentication();

  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);

  const handleOpenToggle = () => {
    setMenuOpen((prevOpen) => {
      const newOpen = !prevOpen;
      return newOpen;
    });
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isSmallScreen && isMenuOpen) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [isSmallScreen, isMenuOpen]);

  const showMenu = !isSmallScreen || isMenuOpen;
  const showOverlay = isSmallScreen && isMenuOpen;

  useEffect(() => {
    if (isMenuOpen && homeLinkRef.current) homeLinkRef.current.focus();
  }, [isMenuOpen]);

  return (
    <div className="fixed right-4.5 bottom-21 left-4.5 z-40 max-h-[85vh] overflow-y-auto sm:sticky sm:top-[-1px] sm:right-auto sm:bottom-auto sm:left-auto sm:w-full sm:overflow-y-visible md:max-h-none">
      <FocusOn returnFocus enabled={showOverlay}>
        <NavMenuProvider
          open={isMenuOpen}
          onOpenToggle={handleOpenToggle}
          onOpenChange={setMenuOpen}
        >
          <div
            className="relative z-10"
            // NOTE: Do not remove, required by anchor link offsets
            id="main-nav"
          >
            {showMenu ? (
              <NavMenu.Root
                onKeyDown={handleKeyDown}
                aria-label={
                  label ??
                  intl.formatMessage({
                    defaultMessage: "Main menu",
                    id: "SY1LIh",
                    description: "Label for the main navigation",
                  })
                }
                data-state={isMenuOpen ? "open" : "closed"}
                className="rounded-md bg-white pt-3 pb-1.5 sm:rounded-none sm:bg-gray-700/90 sm:py-0 dark:bg-gray-600 sm:dark:bg-gray-700/90"
              >
                <Container
                  center
                  size={{ sm: "lg" }}
                  className="items-center px-0 sm:flex sm:justify-between sm:px-6 [&>div]:w-full"
                >
                  <div className="flex items-center justify-center gap-x-6 sm:m-0 sm:hidden">
                    <div className="flex justify-center sm:flex-auto sm:justify-normal">
                      <ThemeSwitcher />
                    </div>

                    <a
                      className="text-right underline outline-none hover:text-primary-600 focus-visible:bg-focus focus-visible:text-black sm:flex-auto dark:hover:text-primary-200"
                      href={languageTogglePath}
                      lang={changeToLang === "en" ? "en" : "fr"}
                    >
                      {intl.formatMessage({
                        defaultMessage:
                          "<hidden>Changer la langue en </hidden>Français",
                        id: "Z3h103",
                        description: "Title for the language toggle link.",
                      })}
                    </a>
                  </div>

                  <MenuSeparator orientation="horizontal" />

                  <NavMenu.List type="main" className="flex">
                    <NavItem
                      className="sm:hidden"
                      href={homeLink?.href ?? paths.home()}
                      title={intl.formatMessage(navigationMessages.home)}
                    />

                    {children}
                    {accountLinks}
                    {loggedIn && (
                      <>
                        <NavMenu.Item
                          className={`m-[0] ${borderItem({
                            borderLeft: true,
                            class:
                              "sm:ml-initial hidden before:mr-3 sm:inline-flex",
                          })}`}
                        >
                          <NotificationDialog
                            open={isNotificationDialogOpen}
                            onOpenChange={setNotificationDialogOpen}
                          />
                        </NavMenu.Item>
                      </>
                    )}
                    {!loggedIn ? (
                      <>
                        <NavItem
                          key="signIn"
                          href={`${paths.login()}${authParams ?? ""}`}
                          title={intl.formatMessage(authMessages.signIn)}
                          className="sm:ml-initial ml-auto"
                        />
                        <NavItem
                          key="signUp"
                          href={`${paths.register()}${authParams ?? ""}`}
                          title={intl.formatMessage(authMessages.signUp)}
                        />
                      </>
                    ) : null}
                  </NavMenu.List>
                </Container>
              </NavMenu.Root>
            ) : null}
          </div>
          <AnimatePresence>
            {showOverlay && (
              <m.div
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-[6] overflow-auto bg-gray-700"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0.85 }}
                exit={{ opacity: 0.85 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </NavMenuProvider>
        {isSmallScreen && (
          <div className="fixed right-4.5 bottom-4.5 z-30 flex gap-3">
            <Button
              color="black"
              mode="solid"
              icon={isMenuOpen ? XMarkIcon : Bars3Icon}
              aria-expanded={isMenuOpen}
              aria-controls="main-nav"
              onClick={() => {
                if (isNotificationDialogOpen) {
                  setNotificationDialogOpen(false);
                  setMenuOpen(true);
                } else {
                  setMenuOpen(!isMenuOpen);
                }
              }}
            >
              {isMenuOpen
                ? intl.formatMessage(uiMessages.closeMenu)
                : intl.formatMessage(uiMessages.openMenu)}
            </Button>
            {loggedIn && (
              <NotificationDialog
                color="black"
                open={isNotificationDialogOpen}
                onOpenChange={() => {
                  if (isMenuOpen) {
                    setMenuOpen(false);
                    setNotificationDialogOpen(true);
                  } else {
                    setNotificationDialogOpen(!isNotificationDialogOpen);
                  }
                }}
              />
            )}
          </div>
        )}
      </FocusOn>
    </div>
  );
};

export default Menu;
