import {
  useEffect,
  useState,
  KeyboardEventHandler,
  useRef,
  ReactNode,
  ReactElement,
} from "react";
import FocusLock from "react-focus-lock";
import { m, AnimatePresence } from "motion/react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import { tv } from "tailwind-variants";

import { notEmpty, useIsSmallScreen } from "@gc-digital-talent/helpers";
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
import {
  ROLE_NAME,
  useAuthorization,
  useAuthentication,
} from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

import useNavContext from "../NavContext/useNavContext";
import useMainNavLinks from "./useMainNavLinks";
import navMenuMessages from "./messages";
import MenuSeparator from "./MenuSeparator";
import HomeLink from "./HomeLink";
import authMessages from "~/messages/authMessages";
import NotificationDialog from "../NotificationDialog/NotificationDialog";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import NavItem from "./MenuItem";

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

const MainNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen("sm");
  const paths = useRoutes();
  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const locale = getLocale(intl);
  const homeLinkRef = useRef<HTMLAnchorElement>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const { loggedIn } = useAuthentication();

  const { roleLinks, mainLinks, resourceLinks, accountLinks, systemSettings } =
    useMainNavLinks();

  const usefulRoleAssignments =
    userAuthInfo?.roleAssignments
      ?.filter(notEmpty)
      ?.filter(
        (roleAssignment) => roleAssignment.role?.name !== ROLE_NAME.BaseUser,
      ) ?? [];

  const roleNames = {
    applicant: intl.formatMessage(navMenuMessages.applicant),
    community: intl.formatMessage(navMenuMessages.community),
    admin: intl.formatMessage(navMenuMessages.admin),
  } as const;

  const hasMoreThanOneRole =
    navRole !== null && usefulRoleAssignments.length > 1;

  const onlyHasOneRoleNotApplicant =
    navRole !== null &&
    usefulRoleAssignments.length === 1 &&
    usefulRoleAssignments[0].role?.name !== ROLE_NAME.Applicant;

  const showRoleSwitcher = onlyHasOneRoleNotApplicant || hasMoreThanOneRole;

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
      <FocusLock returnFocus disabled={!showOverlay}>
        <NavMenuProvider
          open={isMenuOpen}
          onOpenToggle={handleOpenToggle}
          onOpenChange={setMenuOpen}
        >
          <div
            className="relative z-10"
            // NOTE: Do not remove "id", required by anchor link offsets
            id="main-nav"
          >
            {showMenu ? (
              <NavMenu.Root
                onKeyDown={handleKeyDown}
                aria-label={intl.formatMessage({
                  defaultMessage: "Main menu",
                  id: "SY1LIh",
                  description: "Label for the main navigation",
                })}
                data-state={isMenuOpen ? "open" : "closed"}
                className="rounded-md bg-white pt-3 pb-1.5 sm:rounded-none sm:bg-gray-700/90 sm:py-0 dark:bg-gray-600 sm:dark:bg-gray-700/90"
              >
                <Container
                  center
                  size={{ sm: "lg" }}
                  className="items-center px-0 sm:flex sm:justify-between sm:px-6"
                >
                  {/* Mobile header */}
                  <div className="flex items-center justify-center gap-x-6 sm:m-0 sm:hidden">
                    <NavMenu.IconLink
                      ref={homeLinkRef}
                      href={paths.home()}
                      icon={HomeIcon}
                      label={intl.formatMessage(navigationMessages.home)}
                    />

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

                  <NavMenu.List
                    type="main"
                    className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <HomeLink
                      href={paths.home()}
                      label={intl.formatMessage(navigationMessages.home)}
                    />

                    {/* Role Switcher */}
                    {showRoleSwitcher && (
                      <NavMenu.Item
                        className={borderItem({ borderRight: true })}
                      >
                        <NavMenu.Trigger
                          color={isSmallScreen ? "black" : "white"}
                          fixedColor={!isSmallScreen}
                          block={false}
                        >
                          {roleNames[navRole]}
                        </NavMenu.Trigger>
                        <NavMenu.Content>
                          <NavMenu.List>
                            {roleLinks.map((roleLink) => (
                              <NavMenu.Item key={roleLink.name}>
                                <NavMenu.Link
                                  title={roleLink.name}
                                  href={roleLink.href}
                                  type="subMenuLink"
                                >
                                  {roleLink.name}
                                </NavMenu.Link>
                              </NavMenu.Item>
                            ))}
                          </NavMenu.List>
                        </NavMenu.Content>
                      </NavMenu.Item>
                    )}

                    {/* Main Links */}
                    {mainLinks}

                    {/* System Settings */}
                    {systemSettings && (
                      <NavMenu.Item>
                        <NavMenu.Trigger
                          color={isSmallScreen ? "black" : "white"}
                          fixedColor={!isSmallScreen}
                          block={false}
                        >
                          {intl.formatMessage({
                            defaultMessage: "System settings",
                            id: "COIe6t",
                            description:
                              "Nav menu trigger for system settings links sub menu",
                          })}
                        </NavMenu.Trigger>
                        <NavMenu.Content>
                          <NavMenu.List>{systemSettings}</NavMenu.List>
                        </NavMenu.Content>
                      </NavMenu.Item>
                    )}

                    {/* Resources */}
                    <NavMenu.Item>
                      <NavMenu.Trigger
                        color={isSmallScreen ? "black" : "white"}
                        fixedColor={!isSmallScreen}
                        block={false}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Resources",
                          id: "T74kMc",
                          description:
                            "Nav menu trigger for resource links sub menu",
                        })}
                      </NavMenu.Trigger>
                      <NavMenu.Content>
                        <NavMenu.List>{resourceLinks}</NavMenu.List>
                      </NavMenu.Content>
                    </NavMenu.Item>

                    <MenuSeparator orientation="horizontal" />

                    {/* Your Account */}
                    {accountLinks && (
                      <NavMenu.Item>
                        <NavMenu.Trigger
                          color={isSmallScreen ? "black" : "white"}
                          fixedColor={!isSmallScreen}
                          block={false}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Your account",
                            id: "CBedVL",
                            description:
                              "Nav menu trigger for account links sub menu",
                          })}
                        </NavMenu.Trigger>
                        <NavMenu.Content>
                          <NavMenu.List>{accountLinks}</NavMenu.List>
                        </NavMenu.Content>
                      </NavMenu.Item>
                    )}

                    {/* Notification */}
                    {loggedIn && (
                      <NavMenu.Item
                        className={borderItem({
                          borderLeft: true,
                          class: "hidden before:mr-3 sm:inline-flex",
                        })}
                      >
                        <NavMenu.Link href={paths.notifications()}>
                          <NotificationDialog
                            open={isNotificationDialogOpen}
                            onOpenChange={setNotificationDialogOpen}
                          />
                        </NavMenu.Link>
                      </NavMenu.Item>
                    )}

                    {/* Auth Links */}
                    {!loggedIn && (
                      <>
                        <NavItem
                          key="signIn"
                          href={`${paths.login()}`}
                          title={intl.formatMessage(authMessages.signIn)}
                        />
                        <NavItem
                          key="signUp"
                          href={`${paths.register()}`}
                          title={intl.formatMessage(authMessages.signUp)}
                        />
                      </>
                    )}
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
      </FocusLock>
    </div>
  );
};

export default MainNavMenu;
