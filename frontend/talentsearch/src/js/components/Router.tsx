import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import PageContainer, { MenuLink } from "./PageContainer";
import SearchPage from "./search/SearchPage";
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
import RequestPage from "./request/RequestPage";
import WorkLocationPreferenceApi from "./workLocationPreferenceForm/WorkLocationPreferenceForm";
import { ProfilePage } from "./profile/ProfilePage/ProfilePage";
import ExperienceFormContainer from "./experienceForm/ExperienceForm";
import { ExperienceType } from "./experienceForm/types";
import WorkPreferencesApi from "./workPreferencesForm/WorkPreferencesForm";
import { GovInfoFormContainer } from "./GovernmentInfoForm/GovernmentInfoForm";
import LanguageInformationFormContainer from "./languageInformationForm/LanguageInformationForm";
import AboutMeFormContainer from "./aboutMeForm/AboutMeForm";
import DiversityEquityInclusionFormApi from "./diversityEquityInclusion/DiversityEquityInclusionForm";
import { ExperienceAndSkillsRouterApi } from "./applicantProfile/ExperienceAndSkills";
import RoleSalaryFormContainer from "./roleSalaryForm/RoleSalaryForm";
import BrowsePoolsPage from "./browse/BrowsePoolsPage";
import BrowseIndividualPoolApi from "./browse/BrowseIndividualPool";
import PoolApplyPage from "./pool/PoolApplyPage";
import PoolApplicationThanksPage from "./pool/PoolApplicationThanksPage";
import RegisterPage from "./register/RegisterPage";
import LoginPage from "./login/LoginPage";
import { Role } from "../api/generated";

const talentRoutes = (
  talentPaths: TalentSearchRoutes,
): Routes<RouterResult> => [
  {
    path: talentPaths.home(),
    action: () => ({
      component: <div />,
      redirect: talentPaths.search(),
    }),
  },
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
];

const authRoutes = (authPaths: AuthRoutes): Routes<RouterResult> => [
  {
    path: authPaths.register(),
    action: () => ({
      component: <RegisterPage />,
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
): Routes<RouterResult> => [
  {
    path: profilePaths.home(),
    action: () => ({
      component: <ProfilePage />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.governmentInformation(),
    action: () => ({
      component: <GovInfoFormContainer />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.languageInformation(),
    action: () => ({
      component: <LanguageInformationFormContainer />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.workLocation(),
    action: () => ({
      component: <WorkLocationPreferenceApi />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.roleSalary(),
    action: () => ({
      component: <RoleSalaryFormContainer />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: `${profilePaths.skillsAndExperiences()}/:type/create`,
    action: (context) => {
      const experienceType = context.params.type as ExperienceType;
      return {
        component: <ExperienceFormContainer experienceType={experienceType} />,
        authorizedRoles: [Role.Applicant],
      };
    },
  },
  {
    path: `${profilePaths.skillsAndExperiences()}/:type/:id/edit`,
    action: (context) => {
      const experienceType = context.params.type as ExperienceType;
      const experienceId = context.params.id as string;
      return {
        component: (
          <ExperienceFormContainer
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
    path: profilePaths.workPreferences(),
    action: () => ({
      component: <WorkPreferencesApi />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.aboutMe(),
    action: () => ({
      component: <AboutMeFormContainer />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.diversityEquityInclusion(),
    action: () => ({
      component: <DiversityEquityInclusionFormApi />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.skillsAndExperiences(),
    action: () => ({
      component: <ExperienceAndSkillsRouterApi />,
      authorizedRoles: [Role.Applicant],
    }),
  },
  {
    path: profilePaths.profilePage(),
    action: () => ({
      component: <ProfilePage />,
      authorizedRoles: [Role.Applicant],
    }),
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
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const authPaths = useAuthRoutes();
  const talentPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();
  const directIntakePaths = useDirectIntakeRoutes();

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

  /**
   * TO DO: Check auth state when available
   */
  const authLinks = [
    <MenuLink
      key="login-info"
      href={authPaths.login()}
      text={intl.formatMessage({
        defaultMessage: "Login",
        description: "Label displayed on the login link menu item.",
      })}
    />,
    <MenuLink
      key="logout"
      href="/logout" // Replace with real logout
      text={intl.formatMessage({
        defaultMessage: "Logout",
        description: "Label displayed on the logout link menu item.",
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

  return (
    <>
      <PageContainer
        menuItems={menuItems}
        authLinks={authLinks}
        contentRoutes={[
          ...talentRoutes(talentPaths),
          ...authRoutes(authPaths),
          ...(checkFeatureFlag("FEATURE_APPLICANTPROFILE")
            ? profileRoutes(profilePaths)
            : []),
          ...(checkFeatureFlag("FEATURE_DIRECTINTAKE")
            ? directIntakeRoutes(directIntakePaths)
            : []),
        ]}
      />
      <Toast />
    </>
  );
};

export default Router;
