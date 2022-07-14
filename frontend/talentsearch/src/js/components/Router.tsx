import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { AuthenticationContext } from "@common/components/Auth";
import { Button } from "@common/components";
import Dialog from "@common/components/Dialog";
import { Helmet } from "react-helmet";
import { getLocale } from "@common/helpers/localize";
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
import LoggedOutPage from "./loggedOut/LoggedOutPage";
import LoginPage from "./login/LoginPage";
import { CreateAccount } from "./createAccount/CreateAccountPage";
import { Role } from "../api/generated";
import PoolAdvertisementPage from "./pool/PoolAdvertisementPage";

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
): Routes<RouterResult> => [
  {
    path: profilePaths.createAccount(),
    action: () => ({
      component: <CreateAccount />,
    }),
  },
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
  {
    path: directIntakePaths.poolAdvertisement(":id"),
    action: (context) => {
      const poolId = context.params.id as string;
      return {
        component: <PoolAdvertisementPage id={poolId} />,
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
  const { loggedIn, logout } = React.useContext(AuthenticationContext);
  const [isConfirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);

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
      <Helmet>
        <html lang={getLocale(intl)} />
      </Helmet>
      {loggedIn && (
        <Dialog
          confirmation
          centered
          isOpen={isConfirmationOpen}
          onDismiss={() => {
            setConfirmationOpen(false);
          }}
          title={intl.formatMessage({
            defaultMessage: "Logout",
            description:
              "Title for the modal that appears when an authenticated user lands on /logged-out.",
          })}
          footer={
            <div
              data-h2-display="b(flex)"
              data-h2-align-items="b(center)"
              data-h2-justify-content="b(flex-end)"
            >
              <Button
                mode="outline"
                color="primary"
                type="button"
                onClick={() => {
                  setConfirmationOpen(false);
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  description: "Link text to cancel logging out.",
                })}
              </Button>
              <span data-h2-margin="b(left, s)">
                <Button
                  mode="solid"
                  color="primary"
                  type="button"
                  onClick={() => {
                    logout();
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Logout",
                    description: "Link text to logout.",
                  })}
                </Button>
              </span>
            </div>
          }
        >
          <p data-h2-font-size="b(h5)">
            {intl.formatMessage({
              defaultMessage: "Are you sure you would like to logout?",
              description:
                "Question displayed when authenticated user lands on /logged-out.",
            })}
          </p>
        </Dialog>
      )}
    </>
  );
};

export default Router;
