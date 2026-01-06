import { useIntl } from "react-intl";
import uniqBy from "lodash/unionBy";
import { useLocation } from "react-router";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import {
  hasRole,
  ROLE_NAME,
  RoleName,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";
import permissionConstants from "~/constants/permissionConstants";
import pageTitles from "~/messages/pageTitles";

import navMenuMessages from "./messages";
import useNavContext from "../NavContext/useNavContext";
import {
  convertRoleToNavRole,
  isNavRole,
  NAV_ROLES_BY_PRIVILEGE,
} from "../NavContext/NavContextContainer";
import NavItem from "./MenuItem";

/**
 * Builds the navigation structure depending on the current role and if the user is logged in
 */
const useMainNavLinks = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pathname } = useLocation();

  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();
  const roleAssignments = userAuthInfo?.roleAssignments?.filter(notEmpty) ?? [];

  const BrowseJobs = (
    <NavItem
      key="browseJobs"
      href={paths.jobs()}
      title={intl.formatMessage({
        defaultMessage: "Browse jobs",
        id: "ySrsif",
        description: "Label for Browse jobs item",
      })}
    />
  );

  const ViewUsers = hasRole(permissionConstants.viewUsers, roleAssignments) ? (
    <NavItem
      key="viewUsers"
      href={paths.userTable()}
      title={intl.formatMessage(navigationMessages.users)}
    />
  ) : null;

  const ApplicantDashboard = (
    <NavItem
      key="applicantDashboard"
      href={paths.applicantDashboard()}
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

  const Processes = hasRole(
    permissionConstants.viewProcesses,
    roleAssignments,
  ) ? (
    <NavItem
      key="adminProcesses"
      href={paths.poolTable()}
      title={intl.formatMessage(navigationMessages.processes)}
    />
  ) : null;

  const Requests = hasRole(
    permissionConstants.viewRequests,
    roleAssignments,
  ) ? (
    <NavItem
      key="requests"
      href={paths.searchRequestTable()}
      title={intl.formatMessage(navigationMessages.requests)}
    />
  ) : null;

  const Candidates = hasRole(
    permissionConstants.viewCandidates,
    roleAssignments,
  ) ? (
    <NavItem
      key="candidates"
      href={paths.poolCandidates()}
      title={intl.formatMessage(navigationMessages.candidates)}
    />
  ) : null;

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
      href={paths.careerTimeline()}
      title={intl.formatMessage(navigationMessages.careerTimeline)}
      subMenu
    />
  );

  const SkillPortfolio = (
    <NavItem
      key="skillPortfolio"
      href={paths.skillPortfolio()}
      title={intl.formatMessage(navigationMessages.skillPortfolio)}
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

  const ContactSupport = (
    <NavItem
      key="contactSupport"
      href={paths.support()}
      title={intl.formatMessage(navigationMessages.contactUs)}
      subMenu
    />
  );

  const SkillLibrary = (
    <NavItem
      key="skillLibrary"
      href={paths.skills()}
      title={intl.formatMessage(navigationMessages.skillLibrary)}
      subMenu
    />
  );

  const JobTemplates = (
    <NavItem
      key="jobTemplate"
      href={paths.jobPosterTemplates()}
      title={intl.formatMessage(navigationMessages.jobTemplatesLibrary)}
      subMenu
    />
  );

  const Announcements = (
    <NavItem
      key="announcements"
      href={paths.announcements()}
      title={intl.formatMessage(navigationMessages.announcements)}
      subMenu
    />
  );

  const Classifications = (
    <NavItem
      key="classifications"
      href={paths.classificationTable()}
      title={intl.formatMessage(navigationMessages.classifications)}
      subMenu
    />
  );
  const Communities = (
    <NavItem
      key="communities"
      href={paths.communityTable()}
      title={intl.formatMessage(pageTitles.communities)}
      subMenu
    />
  );
  const Departments = (
    <NavItem
      key="departments"
      href={paths.departmentTable()}
      title={intl.formatMessage(navigationMessages.departments)}
      subMenu
    />
  );
  const Skills = (
    <NavItem
      key="skills"
      href={paths.skillTable()}
      title={intl.formatMessage(navigationMessages.skills)}
      subMenu
    />
  );
  const SkillFamilies = (
    <NavItem
      key="skillFamilies"
      href={paths.skillFamilyTable()}
      title={intl.formatMessage(navigationMessages.skillFamilies)}
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
    <NavItem
      key="signOut"
      href={paths.loggedOut()}
      title={intl.formatMessage(authMessages.signOut)}
      state={{ from: pathname }}
      subMenu
    />
  );

  const getRoleName: Record<string, string> = {
    ["applicant"]: intl.formatMessage(navMenuMessages.applicant),
    ["process_operator"]: intl.formatMessage(navMenuMessages.community),
    ["community_recruiter"]: intl.formatMessage(navMenuMessages.community),
    ["community_admin"]: intl.formatMessage(navMenuMessages.community),
    ["community_talent_coordinator"]: intl.formatMessage(
      navMenuMessages.community,
    ),
    ["platform_admin"]: intl.formatMessage(navMenuMessages.admin),
  };

  const getRoleLink: Record<string, string> = {
    ["applicant"]: paths.applicantDashboard(),
    ["process_operator"]: paths.communityDashboard(),
    ["community_recruiter"]: paths.communityDashboard(),
    ["community_admin"]: paths.communityDashboard(),
    ["community_talent_coordinator"]: paths.communityDashboard(),
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
        id: convertRoleToNavRole(role as RoleName),
        name: getRoleName[role],
        href: getRoleLink[role],
      };
    });

  const roleLinksNoDuplicatesAndSorted = uniqBy(roleLinks, "name").sort(
    (a, b) => {
      if (isNavRole(a.id) && isNavRole(b.id))
        return (
          NAV_ROLES_BY_PRIVILEGE.indexOf(a.id) -
          NAV_ROLES_BY_PRIVILEGE.indexOf(b.id)
        );
      return 0;
    },
  );

  const defaultLinks = {
    roleLinks: roleLinksNoDuplicatesAndSorted,
    mainLinks: [FindTalent, BrowseJobs],
    accountLinks: loggedIn ? [SignOut] : null,
    authLinks: !loggedIn ? [SignIn, SignUp] : null,
    resourceLinks: [ContactSupport, SkillLibrary, JobTemplates],
    systemSettings: null,
  };

  switch (navRole) {
    case "applicant":
      return {
        ...defaultLinks,
        mainLinks: [ApplicantDashboard, FindTalent, BrowseJobs],
        accountLinks: loggedIn
          ? [
              ApplicantProfile,
              CareerTimeline,
              SkillPortfolio,
              AccountSettings,
              SignOut,
            ]
          : null,
        resourceLinks: [ContactSupport, SkillLibrary, JobTemplates],
      };
    case "community":
      return {
        ...defaultLinks,
        mainLinks: [CommunityDashboard, Processes, Candidates, Requests],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
        resourceLinks: [ContactSupport, SkillLibrary, JobTemplates],
      };
    case "admin":
      return {
        ...defaultLinks,
        mainLinks: [AdminDashboard, ViewUsers, Processes, Requests],
        accountLinks: loggedIn ? [AccountSettings, SignOut] : null,
        resourceLinks: [ContactSupport, SkillLibrary, JobTemplates],
        systemSettings: [
          Announcements,
          Classifications,
          Communities,
          Departments,
          Skills,
          SkillFamilies,
        ],
      };
    default:
      return {
        ...defaultLinks,
      };
  }
};

export default useMainNavLinks;
