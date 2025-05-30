/* eslint-disable react/forbid-elements */
import FocusLock from "react-focus-lock";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
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

const MainNavMenu = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const isSmallScreen = useIsSmallScreen(1080);

  const shouldReduceMotion = useReducedMotion();

  const animConfig = shouldReduceMotion
    ? {}
    : {
        initial: { transform: "translateY(0)" },
        animate: { transform: "translateY(0)" },
        exit: { transform: "translateY(0)" },
      };

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
    <FocusLock returnFocus disabled={!showOverlay}>
      <NavMenuProvider
        open={isMenuOpen}
        onOpenToggle={handleOpenToggle}
        onOpenChange={setMenuOpen}
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
              <NavMenu.Root
                onKeyDown={handleKeyDown}
                aria-label={intl.formatMessage({
                  defaultMessage: "Main menu",
                  id: "SY1LIh",
                  description: "Label for the main navigation",
                })}
                data-state={isMenuOpen ? "open" : "closed"}
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
                  <div
                    data-h2-display="base(flex) l-tablet(none)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-align-items="base(center)"
                    data-h2-margin="base(x1 x1 0 x1) l-tablet(0)"
                  >
                    <div data-h2-flex="base(1) l-tablet(auto)">
                      <NavMenu.IconLink
                        ref={homeLinkRef}
                        href={paths.home()}
                        icon={HomeIcon}
                        label={intl.formatMessage(navigationMessages.home)}
                      />
                    </div>

                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex="base(2) l-tablet(auto)"
                      data-h2-justify-content="base(center) l-tablet(initial)"
                    >
                      <ThemeSwitcher />
                    </div>
                    <a
                      data-h2-background-color="base:focus-visible(focus)"
                      data-h2-outline="base(none)"
                      data-h2-color="base:hover(secondary.darker) base:focus-visible(black)"
                      data-h2-text-decoration="base(underline)"
                      href={languageTogglePath}
                      lang={changeToLang === "en" ? "en" : "fr"}
                      data-h2-flex="base(1) l-tablet(auto)"
                      data-h2-text-align="base(right)"
                    >
                      {intl.formatMessage({
                        defaultMessage:
                          "<hidden>Changer la langue en </hidden>Français",
                        id: "Z3h103",
                        description: "Title for the language toggle link.",
                      })}
                    </a>
                  </div>
                  <Separator
                    space="none"
                    data-h2-display="l-tablet(none)"
                    data-h2-margin="base(x1 0) l-tablet(0)"
                    data-h2-background-color="base(black.darkest.2) base:dark(black.darkest.5)"
                  />
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column) l-tablet(row)"
                    data-h2-align-items="base(center)"
                  >
                    <NavMenu.List
                      data-h2-flex-direction="base(column) l-tablet(row)"
                      data-h2-align-items="base(center)"
                    >
                      <NavMenu.Item
                        data-h2-display="base(none) l-tablet(flex)"
                        {...((!loggedIn ||
                          onlyHasApplicantRole ||
                          usefulRoleAssignments.length === 0) && {
                          "data-h2-border-right":
                            "base(none) l-tablet:all(1px solid black.light)",
                          "data-h2-padding": "base(0) l-tablet(0 x.75)",
                          "data-h2-margin-right": "base(0) l-tablet(x.75)",
                        })}
                      >
                        {homeLink}
                      </NavMenu.Item>
                      {showRoleSwitcher ? (
                        <>
                          <NavMenu.Item
                            data-h2-border-right="base(none) l-tablet:all(1px solid black.light)"
                            data-h2-border-left="base(0) l-tablet:all(1px solid black.light)"
                            data-h2-padding="base(0) l-tablet(0 x.75)"
                            data-h2-margin-right="base(0) l-tablet(x.75)"
                          >
                            <NavMenu.Trigger
                              color={isSmallScreen ? "black" : "whiteFixed"}
                              mode="text"
                              block={false}
                            >
                              {roleNames[navRole]}
                            </NavMenu.Trigger>
                            <NavMenu.Content
                              data-h2-left="base(auto) l-tablet(-25%)"
                              data-h2-width="base(auto) l-tablet(150%)"
                            >
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
                    {showRoleSwitcher && (
                      <Separator
                        space="none"
                        data-h2-display="l-tablet(none)"
                        data-h2-margin="base(x1 0) l-tablet(0)"
                        data-h2-background-color="base(black.darkest.2) base:dark(black.darkest.5)"
                      />
                    )}
                    <NavMenu.List data-h2-flex-direction="base(column) l-tablet(row)">
                      {mainLinks}
                      {systemSettings && (
                        <NavMenu.Item>
                          <NavMenu.Trigger
                            color={isSmallScreen ? "black" : "whiteFixed"}
                            mode="text"
                            block={false}
                          >
                            {intl.formatMessage({
                              defaultMessage: "System settings",
                              id: "COIe6t",
                              description:
                                "Nav menu trigger for system settings links sub menu",
                            })}
                          </NavMenu.Trigger>
                          <NavMenu.Content
                            data-h2-width="base(150%)"
                            data-h2-left="base(-25%)"
                          >
                            <NavMenu.List>{systemSettings}</NavMenu.List>
                          </NavMenu.Content>
                        </NavMenu.Item>
                      )}
                      <NavMenu.Item>
                        <NavMenu.Trigger
                          color={isSmallScreen ? "black" : "whiteFixed"}
                          mode="text"
                          block={false}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Resources",
                            id: "T74kMc",
                            description:
                              "Nav menu trigger for resource links sub menu",
                          })}
                        </NavMenu.Trigger>
                        <NavMenu.Content
                          data-h2-left="base(auto) l-tablet(-50%)"
                          data-h2-width="base(auto) l-tablet(200%)"
                        >
                          <NavMenu.List>{resourceLinks}</NavMenu.List>
                        </NavMenu.Content>
                      </NavMenu.Item>
                    </NavMenu.List>
                  </div>
                  <Separator
                    space="sm"
                    data-h2-display="l-tablet(none)"
                    data-h2-background-color="base(black.darkest.2) base:dark(black.darkest.5)"
                  />
                  <NavMenu.List
                    data-h2-flex-direction="base(column) l-tablet(row)"
                    data-h2-margin-bottom="base(x1) l-tablet(0)"
                  >
                    {accountLinks && (
                      <NavMenu.Item
                        data-h2-border-right="l-tablet:all(1px solid black.light)"
                        data-h2-padding-right="l-tablet(x.75)"
                      >
                        <NavMenu.Trigger
                          color={isSmallScreen ? "black" : "whiteFixed"}
                          mode="text"
                          block={false}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Your account",
                            id: "CBedVL",
                            description:
                              "Nav menu trigger for account links sub menu",
                          })}
                        </NavMenu.Trigger>
                        <NavMenu.Content
                          data-h2-left="base(auto) l-tablet(-25%)"
                          data-h2-width="base(auto) l-tablet(150%)"
                        >
                          <NavMenu.List>{accountLinks}</NavMenu.List>
                        </NavMenu.Content>
                      </NavMenu.Item>
                    )}
                    {loggedIn && (
                      <>
                        <NavMenu.Item data-h2-display="base(none) l-tablet(inline-flex)">
                          <NotificationDialog
                            open={isNotificationDialogOpen}
                            onOpenChange={setNotificationDialogOpen}
                          />
                        </NavMenu.Item>
                      </>
                    )}
                    {authLinks}
                  </NavMenu.List>
                </div>
              </NavMenu.Root>
            </m.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {showOverlay && (
            <m.div
              onClick={() => setMenuOpen(false)}
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
      {isSmallScreen && (
        <div
          data-h2-position="base(fixed)"
          data-h2-bottom="base(x.75)"
          data-h2-right="base(x.75)"
          data-h2-z-index="base(10)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x.5)"
        >
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
              data-h2-display="l-tablet(none)"
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
  );
};

export default MainNavMenu;
