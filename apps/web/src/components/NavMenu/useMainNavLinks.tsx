import { useIntl } from "react-intl";
import uniqBy from "lodash/unionBy";

import { NavMenu } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { RoleAssignment } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import {
  convertRoleToNavRole,
  NavRole,
} from "../NavContext/NavContextContainer";
import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";

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
      <NavMenu.Link href={href} color={subMenu ? "black" : undefined}>
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

  const CommunityHomePage = (
    <NavItem
      key="communityHomePage"
      href={paths.community()}
      title={intl.formatMessage(navigationMessages.home)}
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

  const getRoleName = {
    ["guest"]: "Guest",
    ["applicant"]: "Applicant",
    ["manager"]: "Manager",
    ["community"]: "Community",
    ["admin"]: "Admin",
  };

  const roles: Record<string, string> = {
    ["guest"]: paths.home(),
    ["applicant"]: paths.applicantDashboard(),
    ["manager"]: paths.manager(),
    ["community"]: paths.community(),
    ["admin"]: paths.adminDashboard(),
  };

  const roleLinks = roleAssignments
    .filter(
      (roleAssignment) => roleAssignment.role?.name !== ROLE_NAME.BaseUser,
    )
    .map((roleAssignment) => {
      const role = convertRoleToNavRole(roleAssignment.role?.name as RoleName);

      return {
        name: getRoleName[role],
        href: roles[role],
      };
    });

  const roleLinksNoDuplicates = uniqBy(roleLinks, "name");

  const defaultLinks = {
    roleLinks: roleLinksNoDuplicates,
    currentRoleName: navRole,
    authLinks: !loggedIn ? [SignIn, SignUp] : null,
  };

  switch (navRole) {
    case "guest":
      return {
        ...defaultLinks,
        mainLinks: [
          Home,
          BrowseJobs,
          // // uncomment to test scrolling on mobile view
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
          // BrowseJobs,
        ],
      };
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
        mainLinks: [
          CommunityHomePage,
          CommunityDashboard,
          Processes,
          Candidates,
        ],
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
        roleLinks: defaultLinks.roleLinks,
        mainLinks: [Home, BrowseJobs],
        accountLinks: [],
        authLinks: defaultLinks.authLinks,
      };
  }
};

export default useMainNavLinks;