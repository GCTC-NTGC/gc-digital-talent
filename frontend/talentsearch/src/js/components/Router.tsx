import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import useFeatureFlags from "@common/hooks/useFeatureFlags";
import { AuthenticationContext } from "@common/components/Auth";
import LogoutConfirmation from "@common/components/LogoutConfirmation";
import { Helmet } from "react-helmet";
import { getLocale } from "@common/helpers/localize";
import Pending from "@common/components/Pending";
import PageContainer, { MenuLink } from "./PageContainer";
import {
  useTalentSearchRoutes,
  TalentSearchRoutes,
} from "../talentSearchRoutes";
import {
  ApplicantProfileRoutes,
  useApplicantProfileRoutes,
} from "../applicantProfileRoutes";
import { AuthRoutes, useAuthRoutes } from "../authRoutes";
import {
  DirectIntakeRoutes,
  useDirectIntakeRoutes,
} from "../directIntakeRoutes";
import { ExperienceType } from "./experienceForm/types";
import { Role, useGetAboutMeQuery } from "../api/generated";

/** Search */
const SearchPage = React.lazy(() => import("./search/SearchPage"));
const RequestPage = React.lazy(() => import("./request/RequestPage"));

/** Auth */
const RegisterPage = React.lazy(() => import("./register/RegisterPage"));
const LoggedOutPage = React.lazy(() => import("./loggedOut/LoggedOutPage"));
const LoginPage = React.lazy(() => import("./login/LoginPage"));

/** Profile */
const CreateAccount = React.lazy(
  () => import("./createAccount/CreateAccountPage"),
);
const ProfilePage = React.lazy(
  () => import("./profile/ProfilePage/ProfilePage"),
);
const GovernmentInfoFormPage = React.lazy(
  () => import("./GovernmentInfoForm/GovernmentInfoFormPage"),
);
const LanguageInformationFormPage = React.lazy(
  () => import("./languageInformationForm/LanguageInformationFormPage"),
);
const WorkLocationPreferenceFormPage = React.lazy(
  () => import("./workLocationPreferenceForm/WorkLocationPreferenceFormPage"),
);
const RoleSalaryFormPage = React.lazy(
  () => import("./roleSalaryForm/RoleSalaryFormPage"),
);
const ExperienceFormContainer = React.lazy(
  () => import("./experienceForm/ExperienceForm"),
);
const WorkPreferencesFormPage = React.lazy(
  () => import("./workPreferencesForm/WorkPreferencesFormPage"),
);
const AboutMeFormPage = React.lazy(
  () => import("./aboutMeForm/AboutMeFormPage"),
);
const EmploymentEquityFormPage = React.lazy(
  () => import("./employmentEquityForm/EmploymentEquityFormPage"),
);
const ExperienceAndSkillsPage = React.lazy(
  () => import("./experienceAndSkills/ExperienceAndSkillsPage"),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() => import("./browse/BrowsePoolsPage"));
const BrowseIndividualPoolApi = React.lazy(
  () => import("./browse/BrowseIndividualPool"),
);
const PoolApplyPage = React.lazy(() => import("./pool/PoolApplyPage"));
const PoolApplicationThanksPage = React.lazy(
  () => import("./pool/PoolApplicationThanksPage"),
);
const PoolAdvertisementPage = React.lazy(
  () => import("./pool/PoolAdvertisementPage"),
);

const talentRoutes = (
  talentPaths: TalentSearchRoutes,
): Routes<RouterResult> => [
  {
    path: talentPaths.search(),
    action: () => ({
      component: <SearchPage />,
    }),
  },
  {
    path: talentPaths.request(),
    action: () => ({
      component: <RequestPage />,
    }),
  },
  {
    path: `${talentPaths.home()}/search`,
    action: () => ({
      component: <div />,
      redirect: talentPaths.search(),
    }),
  },
];

const authRoutes = (authPaths: AuthRoutes): Routes<RouterResult> => [
  {
    path: authPaths.register(),
    action: () => ({
      component: <RegisterPage />,
    }),
  },
  {
    path: authPaths.loggedOut(),
    action: () => ({
      component: <LoggedOutPage />,
    }),
  },
  {
    path: authPaths.login(),
    action: () => ({
      component: <LoginPage />,
    }),
  },
];

const profileRoutes = (
  profilePaths: ApplicantProfileRoutes,
  myUserId?: string,
): Routes<RouterResult> => [
  {
    path: profilePaths.createAccount(),
    action: () => ({
      component: <CreateAccount />,
    }),
  },
  {
    path: profilePaths.home(":userId"),
    action: () => ({
      component: <ProfilePage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.governmentInformation(":userId"),
    action: (context) => {
      const userId = context.params.userId as string;
      return {
        component: <GovernmentInfoFormPage meId={userId} />,
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: profilePaths.languageInformation(":userId"),
    action: () => ({
      component: <LanguageInformationFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.workLocation(":userId"),
    action: () => ({
      component: <WorkLocationPreferenceFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.roleSalary(":userId"),
    action: () => ({
      component: <RoleSalaryFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: `${profilePaths.skillsAndExperiences(":userId")}/:type/create`,
    action: (context) => {
      const userId = context.params.userId as string;
      const experienceType = context.params.type as ExperienceType;
      return {
        component: (
          <ExperienceFormContainer
            userId={userId}
            experienceType={experienceType}
          />
        ),
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: `${profilePaths.skillsAndExperiences(":userId")}/:type/:id/edit`,
    action: (context) => {
      const userId = context.params.userId as string;
      const experienceType = context.params.type as ExperienceType;
      const experienceId = context.params.id as string;
      return {
        component: (
          <ExperienceFormContainer
            userId={userId}
            experienceType={experienceType}
            experienceId={experienceId}
            edit
          />
        ),
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: profilePaths.workPreferences(":userId"),
    action: () => ({
      component: <WorkPreferencesFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.aboutMe(":userId"),
    action: () => ({
      component: <AboutMeFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.diversityEquityInclusion(":userId"),
    action: () => ({
      component: <EmploymentEquityFormPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.skillsAndExperiences(":userId"),
    action: () => ({
      component: <ExperienceAndSkillsPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },

  // Old routes - these redirect to the current route for the page
  {
    path: profilePaths.myProfile(),
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.home(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/create-account`,
    action: () => ({
      component: <div />,
      redirect: profilePaths.createAccount(),
    }),
  },
  {
    path: `${profilePaths.myProfile()}/about-me`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.aboutMe(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/language-information`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId
        ? profilePaths.languageInformation(myUserId)
        : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/government-information`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId
        ? profilePaths.governmentInformation(myUserId)
        : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/role-salary`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.roleSalary(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/work-location`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.workLocation(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/work-preferences`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.workPreferences(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/diversity-and-inclusion`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId
        ? profilePaths.diversityEquityInclusion(myUserId)
        : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId
        ? profilePaths.skillsAndExperiences(myUserId)
        : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/award/create`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.createAward(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/community/create`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.createCommunity(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/education/create`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.createEducation(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/personal/create`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.createPersonal(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/work`,
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
      redirect: myUserId ? profilePaths.createWork(myUserId) : undefined,
    }),
  },
  {
    path: `${profilePaths.myProfile()}/skills-and-experiences/:type/:id/edit`,
    action: (context) => {
      const experienceType = context.params.type as ExperienceType;
      const experienceId = context.params.id as string;
      return {
        component: <div />,
        authorizedRoles: [Role.Applicant],
        redirect: myUserId
          ? profilePaths.editExperience(myUserId, experienceType, experienceId)
          : undefined,
      };
    },
  },
];

const directIntakeRoutes = (
  directIntakePaths: DirectIntakeRoutes,
): Routes<RouterResult> => [
  {
    path: directIntakePaths.home(),
    action: () => ({
      component: <div />,
      redirect: directIntakePaths.allPools(),
    }),
  },
  {
    path: directIntakePaths.allPools(),
    action: () => ({
      component: <BrowsePoolsPage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: directIntakePaths.pool(":id"),
    action: (context) => {
      const poolId = context.params.id as string;
      return {
        component: <BrowseIndividualPoolApi poolId={poolId} />,
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: directIntakePaths.poolApply(":id"),
    action: (context) => {
      const poolId = context.params.id as string;
      return {
        component: <PoolApplyPage id={poolId} />,
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: directIntakePaths.poolApplyThanks(":id"),
    action: (context) => {
      const poolId = context.params.id as string;
      return {
        component: <PoolApplicationThanksPage id={poolId} />,
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: directIntakePaths.poolAdvertisement(":id"),
    action: (context) => {
      const poolId = context.params.id as string;
      return {
        component: <PoolAdvertisementPage id={poolId} />,
      };
    },
  },
  {
    path: directIntakePaths.applications(":userId"),
    action: () => ({
      component: <div />,
      authorizedRoles: [Role.Applicant],
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const authPaths = useAuthRoutes();
  const talentPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();
  const directIntakePaths = useDirectIntakeRoutes();
  const featureFlags = useFeatureFlags();
  const { loggedIn, logout } = React.useContext(AuthenticationContext);
  const [isConfirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;

  const menuItems = [
    <MenuLink
      key="search"
      href={talentPaths.search()}
      text={intl.formatMessage({
        defaultMessage: "Search",
        description: "Label displayed on the Search menu item.",
      })}
    />,
    <MenuLink
      key="request"
      href={talentPaths.request()}
      text={intl.formatMessage({
        defaultMessage: "Request",
        description: "Label displayed on the Request menu item.",
      })}
    />,
  ];

  if (featureFlags.directIntake) {
    menuItems.push(
      <MenuLink
        key="browseOpportunities"
        href={directIntakePaths.allPools()}
        text={intl.formatMessage({
          defaultMessage: "Browse opportunities",
          description: "Label displayed on the browse pools menu item.",
        })}
      />,
    );

    if (featureFlags.directIntake && loggedIn && data?.me?.id) {
      menuItems.push(
        <MenuLink
          key="myApplications"
          href={directIntakePaths.applications(data.me.id)}
          text={intl.formatMessage({
            defaultMessage: "My applications",
            description:
              "Label displayed on the users pool applications menu item.",
          })}
        />,
      );
    }
  }

  if (featureFlags.applicantProfile && loggedIn && data?.me?.id) {
    menuItems.push(
      <MenuLink
        key="myProfile"
        href={profilePaths.home(data.me.id)}
        text={intl.formatMessage({
          defaultMessage: "My profile",
          description: "Label displayed on the applicant profile menu item.",
        })}
      />,
    );
  }

  let authLinks = [
    <MenuLink
      key="login-info"
      href={authPaths.login()}
      text={intl.formatMessage({
        defaultMessage: "Login",
        description: "Label displayed on the login link menu item.",
      })}
    />,
    <MenuLink
      key="register"
      href={authPaths.register()}
      text={intl.formatMessage({
        defaultMessage: "Register",
        description: "Label displayed on the register link menu item.",
      })}
    />,
  ];
  if (loggedIn) {
    authLinks = [
      <MenuLink
        key="logout"
        as="button"
        onClick={() => {
          if (loggedIn) {
            setConfirmationOpen(true);
          }
        }}
        text={intl.formatMessage({
          defaultMessage: "Logout",
          description: "Label displayed on the logout link menu item.",
        })}
      />,
    ];
  }

  return (
    <Pending fetching={fetching} error={error}>
      <PageContainer
        menuItems={menuItems}
        authLinks={authLinks}
        contentRoutes={[
          ...talentRoutes(talentPaths),
          ...authRoutes(authPaths),
          ...(featureFlags.applicantProfile
            ? profileRoutes(profilePaths, data?.me?.id)
            : []),
          ...(featureFlags.directIntake
            ? directIntakeRoutes(directIntakePaths)
            : []),
        ]}
      />
      <Helmet>
        <html lang={locale} />
      </Helmet>
      {loggedIn && (
        <LogoutConfirmation
          isOpen={isConfirmationOpen}
          onDismiss={() => setConfirmationOpen(false)}
          onLogout={() => logout()}
        />
      )}
    </Pending>
  );
};

export default Router;
