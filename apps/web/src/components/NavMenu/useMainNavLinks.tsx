import { useIntl } from "react-intl";
import uniqBy from "lodash/unionBy";

import { NavMenu } from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { RoleAssignment } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import { NavRole } from "../NavContext/NavContextContainer";
import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";
import navMenuMessages from "./messages";

export const NavItem = ({
  key,
  href,
  title,
  subMenu,
  ...rest
}: {
  key: string;
  href: string;
  title: string;
  subMenu?: boolean;
}) => {
  return (
    <NavMenu.Item key={key} {...rest}>
      <NavMenu.Link href={href} type={subMenu ? "subMenuLink" : "link"}>
        {title}
      </NavMenu.Link>
    </NavMenu.Item>
  );
};

/**
 * Builds the navigation structure depending on the current role and if the user is logged in
 * @param navRole The current navigation role of the user
 * @param loggedIn If the user is logged in
 * @returns
 */
const useMainNavLinks = (
  navRole: NavRole,
  loggedIn: boolean,
  roleAssignments: RoleAssignment[],
) => {
  const intl = useIntl();
  const paths = useRoutes();

  const Home = (
    <NavItem
      key="home"
      href={paths.home()}
      title={intl.formatMessage(navigationMessages.home)}
    />
  );

  const BrowseJobs = (
    <NavItem
      key="browseJobs"
      href={paths.browsePools()}
      title={intl.formatMessage(navigationMessages.browseJobs)}
    />
  );

  const ViewUsers = (
    <NavItem
      key="viewUsers"
      href={paths.userTable()}
      title={intl.formatMessage(navigationMessages.users)}
    />
  );

  const ApplicantDashboard = (
    <NavItem
      key="applicantDashboard"
      href={paths.applicantDashboard()}
      title={intl.formatMessage(navigationMessages.dashboard)}
    />
  );

  const ManagerHomePage = (
    <NavItem
      key="managerHomePage"
      href={paths.manager()}
      title={intl.formatMessage(navigationMessages.home)}
    />
  );

  const ManagerDashboard = (
    <NavItem
      key="managerDashboard"
      href={paths.managerDashboard()}
      title={intl.formatMessage(navigationMessages.dashboard)}
    />
  );

  const CommunityDashboard = (
    <NavItem
      key="communityDashboard"
      href={paths.communityDashboard()}
      title={intl.formatMessage(navigationMessages.dashboard)}
    />
  );

  const AdminDashboard = (
    <NavItem
      key="adminDashboard"
      href={paths.adminDashboard()}
      title={intl.formatMessage(navigationMessages.dashboard)}
    />
  );

  const Processes = (
    <NavItem
      key="adminProcesses"
      href={paths.poolTable()}
      title={intl.formatMessage(navigationMessages.processes)}
    />
  );

  const Requests = (
    <NavItem
      key="requests"
      href={paths.searchRequestTable()}
      title={intl.formatMessage(navigationMessages.requests)}
    />
  );

  const Candidates = (
    <NavItem
      key="candidates"
      href={paths.poolCandidates()}
      title={intl.formatMessage(navigationMessages.candidates)}
    />
  );

  const FindTalent = (
    <NavItem
      key="findTalent"
      href={paths.search()}
      title={intl.formatMessage(navigationMessages.findTalent)}
    />
  );

  const ApplicantProfile = (
    <NavItem
      key="applicantProfile"
      href={paths.profile()}
      title={intl.formatMessage(navigationMessages.applicantProfile)}
      subMenu
    />
  );

  const CareerTimeline = (
    <NavItem
      key="careerTimeline"
      href={paths.careerTimelineAndRecruitment()}
      title={intl.formatMessage(
        navigationMessages.careerTimelineAndRecruitment,
      )}
      subMenu
    />
  );

  const SkillLibrary = (
    <NavItem
      key="skillLibrary"
      href={paths.skillPortfolio()}
      title={intl.formatMessage(navigationMessages.skillPortfolio)}
      subMenu
    />
  );

  const ManagerProfile = (
    <NavItem
      key="managerProfile"
      href={paths.profile()}
      title={intl.formatMessage(navigationMessages.managerProfile)}
      subMenu
    />
  );

  const AccountSettings = (
    <NavItem
      key="accountSettings"
      href={paths.accountSettings()}
      title={intl.formatMessage(navigationMessages.accountSettings)}
      subMenu
    />
  );

  const SignIn = (
    <NavItem
      key="signIn"
      href={paths.login()}
      title={intl.formatMessage(authMessages.signIn)}
    />
  );

  const SignUp = (
    <NavItem
      key="signUp"
      href={paths.register()}
      title={intl.formatMessage(authMessages.signUp)}
    />
  );

  const SignOut = (
    <SignOutConfirmation key="sign-out">
      <LogoutButton>{intl.formatMessage(authMessages.signOut)}</LogoutButton>
    </SignOutConfirmation>
  );

  const getRoleName: Record<string, string> = {
    ["applicant"]: intl.formatMessage(navMenuMessages.applicant),
    ["manager"]: intl.formatMessage(navMenuMessages.manager),
    ["pool_operator"]: intl.formatMessage(navMenuMessages.community),
    ["request_responder"]: intl.formatMessage(navMenuMessages.community),
    ["community_manager"]: intl.formatMessage(navMenuMessages.community),
    ["process_operator"]: intl.formatMessage(navMenuMessages.community),
    ["community_recruiter"]: intl.formatMessage(navMenuMessages.community),
    ["community_admin"]: intl.formatMessage(navMenuMessages.community),
    ["platform_admin"]: intl.formatMessage(navMenuMessages.admin),
  };

  const getRoleLink: Record<string, string> = {
    ["applicant"]: paths.applicantDashboard(),
    ["manager"]: paths.manager(),
    ["pool_operator"]: paths.communityDashboard(),
    ["request_responder"]: paths.communityDashboard(),
    ["community_manager"]: paths.communityDashboard(),
    ["process_operator"]: paths.communityDashboard(),
    ["community_recruiter"]: paths.communityDashboard(),
    ["community_admin"]: paths.communityDashboard(),
    ["platform_admin"]: paths.adminDashboard(),
  };

  const roleLinks = roleAssignments
    .filter(
      (roleAssignment) => roleAssignment.role?.name !== ROLE_NAME.BaseUser,
    )
    .map((roleAssignment) => {
      const role = roleAssignment.role?.name;

      if (role === undefined) {
        return {
          name: intl.formatMessage(commonMessages.notFound),
          href: paths.notFound(),
        };
      }

      return {
        name: getRoleName[role],
        href: getRoleLink[role],
      };
    });

  const roleLinksNoDuplicates = uniqBy(roleLinks, "name");

  const defaultLinks = {
    roleLinks: roleLinksNoDuplicates,
    currentRoleName: navRole,
    accountLinks: null,
    authLinks: !loggedIn ? [SignIn, SignUp] : null,
  };

  switch (navRole) {
    case "applicant":
      return {
        ...defaultLinks,
        mainLinks: [Home, ApplicantDashboard, BrowseJobs],
        accountLinks: loggedIn
          ? [
              ApplicantProfile,
              CareerTimeline,
              SkillLibrary,
              AccountSettings,
              SignOut,
            ]
          : null,
      };
    case "manager":
      return {
        ...defaultLinks,
        mainLinks: [ManagerHomePage, ManagerDashboard, FindTalent],
        accountLinks: loggedIn
          ? [ManagerProfile, AccountSettings, SignOut]
          : null,
      };
    case "community":
      return {
        ...defaultLinks,
        mainLinks: [Home, CommunityDashboard, Processes, Candidates],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
      };
    case "admin":
      return {
        ...defaultLinks,
        mainLinks: [Home, AdminDashboard, ViewUsers, Processes, Requests],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
      };
    default:
      return {
        ...defaultLinks,
        mainLinks: [Home, BrowseJobs],
      };
  }
};

export default useMainNavLinks;
