import { useIntl } from "react-intl";

import { NavMenu } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import { NavRole } from "../NavContext/NavContextContainer";
import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";

const NavItem = ({
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
export const useMainLinks = (navRole: NavRole, loggedIn: boolean) => {
  const intl = useIntl();
  const paths = useRoutes();

  const Home = (
    <NavItem
      key="home"
      href={paths.home()}
      title={intl.formatMessage(navigationMessages.home)}
    />
  );
  const FindTalent = (
    <NavItem
      key="findTalent"
      href={paths.search()}
      title={intl.formatMessage(navigationMessages.findTalent)}
    />
  );
  const BrowseJobs = (
    <NavItem
      key="browseJobs"
      href={paths.browsePools()}
      title={intl.formatMessage(navigationMessages.browseJobs)}
    />
  );

  /* COMMUNITY ROLE MAIN LINKS */
  const Processes = (
    <NavItem
      key="communityProcesses"
      href="#" // Replace with community processes
      title={intl.formatMessage(navigationMessages.processes)}
    />
  );
  const Candidates = (
    <NavItem
      key="communityCandidates"
      href="#" // Replace with community specific table
      title={intl.formatMessage(navigationMessages.candidates)}
    />
  );

  /* ADMIN ROLE MAIN LINKS */
  const ViewUsers = (
    <NavItem
      key="viewUsers"
      href={paths.userTable()}
      title={intl.formatMessage(navigationMessages.users)}
    />
  );
  const AdminProcesses = (
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

  /* APPLICANT ROLE ACCOUNT LINKS */
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
      href={paths.skillLibrary()}
      title={intl.formatMessage(navigationMessages.skillLibrary)}
      subMenu
    />
  );

  /* MANAGER ROLE ACCOUNT LINKS */
  const ManagerProfile = (
    <NavItem
      key="managerProfile"
      href={paths.profile()}
      title={intl.formatMessage(navigationMessages.managerProfile)}
      subMenu
    />
  );

  /* COMMUNITY ROLE ACCOUNT LINKS */
  // none

  /* ADMIN ROLE ACCOUNT LINKS */
  // none

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

  switch (navRole) {
    case "guest":
      return {
        mainLinks: [Home, BrowseJobs],
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
    case "applicant":
      return {
        mainLinks: [Home, BrowseJobs],
        accountLinks: loggedIn
          ? [
              ApplicantProfile,
              CareerTimeline,
              SkillLibrary,
              AccountSettings,
              SignOut,
            ]
          : null,
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
    case "manager":
      return {
        mainLinks: [Home, FindTalent],
        accountLinks: loggedIn
          ? [ManagerProfile, AccountSettings, SignOut]
          : null,
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
    case "community":
      return {
        mainLinks: [Home, Processes, Candidates],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
    case "admin":
      return {
        mainLinks: [Home, ViewUsers, AdminProcesses, Requests],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
    default:
      return {
        mainLinks: [Home, BrowseJobs],
        authLinks: !loggedIn ? [SignIn, SignUp] : null,
      };
  }
};
