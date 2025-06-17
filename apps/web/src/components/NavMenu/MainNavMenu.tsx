/* eslint-disable react/forbid-elements */
import FocusLock from "react-focus-lock";
import { m, AnimatePresence } from "motion/react";
import {
  useEffect,
  useState,
  KeyboardEventHandler,
  useCallback,
  useRef,
} from "react";
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
  NavMenu,
  Separator,
  NavMenuProvider,
  Container,
} from "@gc-digital-talent/ui";
import {
  ROLE_NAME,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

import NotificationDialog from "../NotificationDialog/NotificationDialog";
import useNavContext from "../NavContext/useNavContext";
import useMainNavLinks from "./useMainNavLinks";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import navMenuMessages from "./messages";

const borderItem = tv({
  base: "sm:border-x sm:border-white/20 sm:px-4.5",
});

const homeItem = tv({
  base: "hidden sm:flex",
  variants: {
    hidden: {
      true: "sm:border-r sm:border-white/20 sm:px-4.5",
    },
  },
});

const MenuSeparator = () => (
  <Separator
    decorative
    space="none"
    className="my-6 bg-black/20 sm:hidden dark:bg-black/50"
  />
);

const MainNavMenu = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const isSmallScreen = useIsSmallScreen(1080);

  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);

  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const {
    homeLink,
    roleLinks,
    mainLinks,
    resourceLinks,
    accountLinks,
    authLinks,
    systemSettings,
  } = useMainNavLinks();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleOpenToggle = useCallback(() => {
    setMenuOpen((prevOpen) => {
      const newOpen = !prevOpen;
      return newOpen;
    });
  }, [setMenuOpen]);
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

  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);

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

  const onlyHasApplicantRole =
    navRole !== null &&
    usefulRoleAssignments.length === 1 &&
    usefulRoleAssignments[0].role?.name === ROLE_NAME.Applicant;

  const showRoleSwitcher = onlyHasOneRoleNotApplicant || hasMoreThanOneRole;

  const showMenu = !isSmallScreen || isMenuOpen;
  const showOverlay = isSmallScreen && isMenuOpen;

  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isMenuOpen && homeLinkRef.current) homeLinkRef.current.focus();
  }, [isMenuOpen]);

  return (
    <div className="fixed right-4.5 bottom-21 left-4.5 z-7 max-h-[85vh] overflow-y-auto sm:sticky sm:top-[-1px] sm:right-auto sm:bottom-auto sm:left-auto sm:w-full sm:overflow-y-visible md:max-h-none">
      <FocusLock returnFocus disabled={!showOverlay}>
        <NavMenuProvider
          open={isMenuOpen}
          onOpenToggle={handleOpenToggle}
          onOpenChange={setMenuOpen}
        >
          <div className="relative z-10">
            {showMenu ? (
              <NavMenu.Root
                onKeyDown={handleKeyDown}
                aria-label={intl.formatMessage({
                  defaultMessage: "Main menu",
                  id: "SY1LIh",
                  description: "Label for the main navigation",
                })}
                data-state={isMenuOpen ? "open" : "closed"}
                className="rounded-md bg-white py-6 sm:rounded-none sm:bg-gray-700/90 sm:py-6 dark:bg-gray-600/90 sm:dark:bg-gray-700/90"
              >
                <Container
                  center
                  size={{ sm: "lg" }}
                  className="items-center px-0 sm:flex sm:justify-between sm:px-6"
                >
                  <div className="mx-6 flex items-center justify-between sm:m-0 sm:hidden">
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
                      className="text-right underline outline-none hover:text-primary-600 focus-visible:bg-focus focus-visible:text-black sm:flex-auto dark:hover:text-secondary-200"
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

                  <MenuSeparator />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4.5">
                    <NavMenu.List className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4.5">
                      <NavMenu.Item
                        className={homeItem({
                          hidden:
                            !loggedIn ||
                            onlyHasApplicantRole ||
                            usefulRoleAssignments.length === 0,
                        })}
                      >
                        {homeLink}
                      </NavMenu.Item>
                      {showRoleSwitcher ? (
                        <>
                          <NavMenu.Item className={borderItem()}>
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
                        </>
                      ) : null}
                    </NavMenu.List>

                    {showRoleSwitcher && <MenuSeparator />}

                    <NavMenu.List className="flex flex-col sm:flex-row">
                      {mainLinks}
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
                    </NavMenu.List>
                  </div>

                  <MenuSeparator />

                  <NavMenu.List className="flex flex-col sm:flex-row sm:gap-x-4.5">
                    {accountLinks && (
                      <NavMenu.Item className={borderItem()}>
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

                    {loggedIn && (
                      <>
                        <NavMenu.Item className="hidden sm:inline-flex">
                          <NotificationDialog
                            open={isNotificationDialogOpen}
                            onOpenChange={setNotificationDialogOpen}
                          />
                        </NavMenu.Item>
                      </>
                    )}
                    {authLinks}
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
          <div className="fixed right-4.5 bottom-4.5 z-10 flex gap-3">
            <Button
              color="black"
              mode="solid"
              icon={isMenuOpen ? XMarkIcon : Bars3Icon}
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
