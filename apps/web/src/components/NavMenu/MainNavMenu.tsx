import { useIntl } from "react-intl";

import { notEmpty, useIsSmallScreen } from "@gc-digital-talent/helpers";
import { NavMenu } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import useNavContext from "../NavContext/useNavContext";
import useMainNavLinks from "./useMainNavLinks";
import navMenuMessages from "./messages";
import Menu, { borderItem } from "./Menu";
import MenuSeparator from "./MenuSeparator";
import HomeLink from "./HomeLink";

const MainNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen("sm");
  const paths = useRoutes();
  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();

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

  return (
    <Menu
      accountLinks={
        accountLinks && (
          <NavMenu.Item className="ml-auto">
            <NavMenu.Trigger
              color={isSmallScreen ? "black" : "white"}
              fixedColor={!isSmallScreen}
              block={false}
            >
              {intl.formatMessage({
                defaultMessage: "Your account",
                id: "CBedVL",
                description: "Nav menu trigger for account links sub menu",
              })}
            </NavMenu.Trigger>
            <NavMenu.Content>
              <NavMenu.List>{accountLinks}</NavMenu.List>
            </NavMenu.Content>
          </NavMenu.Item>
        )
      }
    >
      <HomeLink
        href={paths.home()}
        label={intl.formatMessage(navigationMessages.home)}
      />
      {showRoleSwitcher ? (
        <NavMenu.Item
          className={borderItem({
            borderRight: true,
          })}
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
      ) : null}

      {showRoleSwitcher && <MenuSeparator orientation="horizontal" />}

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

      <NavMenu.Item className="mt-0 border-b-[1px] border-black/20 pb-3 sm:border-b-[0px] sm:pb-0 dark:border-white/20">
        <NavMenu.Trigger
          color={isSmallScreen ? "black" : "white"}
          fixedColor={!isSmallScreen}
          block={false}
        >
          {intl.formatMessage({
            defaultMessage: "Resources",
            id: "T74kMc",
            description: "Nav menu trigger for resource links sub menu",
          })}
        </NavMenu.Trigger>
        <NavMenu.Content>
          <NavMenu.List>{resourceLinks}</NavMenu.List>
        </NavMenu.Content>
      </NavMenu.Item>
    </Menu>
  );
};

export default MainNavMenu;
