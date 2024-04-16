import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import {
  RequireAuth,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  ROLE_NAME,
} from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { lazyRetry } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";
import { useFeatureFlags, FeatureFlags } from "@gc-digital-talent/env";

import Layout from "~/components/Layout/Layout";
import AdminLayout from "~/components/Layout/AdminLayout/AdminLayout";
import IAPLayout from "~/components/Layout/IAPLayout";
import { TalentRedirect, ProfileRedirect } from "~/components/Redirects";
import CreateAccountRedirect from "~/pages/Auth/CreateAccountPage/CreateAccountRedirect";
import useRoutes from "~/hooks/useRoutes";
import ScreeningAndEvaluationPage from "~/pages/Pools/ScreeningAndEvaluationPage/ScreeningAndEvaluationPage";

/** Home */
const HomePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Home/HomePage/HomePage")),
);
const ExecutiveHomePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Home/ExecutiveHomePage/ExecutiveHomePage")),
);
const ManagerHomePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Home/ManagerHomePage/ManagerHomePage")),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Errors/ErrorPage/ErrorPage")),
);
const SupportPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SupportPage/SupportPage")),
);
const TermsAndConditions = React.lazy(() =>
  lazyRetry(() => import("../pages/TermsAndConditions/TermsAndConditions")),
);
const PrivacyPolicy = React.lazy(() =>
  lazyRetry(() => import("../pages/PrivacyPolicy/PrivacyPolicy")),
);
const AccessibilityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import("../pages/AccessibilityStatementPage/AccessibilityStatementPage"),
  ),
);

/** Search */
const SearchPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SearchRequests/SearchPage/SearchPage")),
);
const RequestPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SearchRequests/RequestPage/RequestPage")),
);
const RequestConfirmationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage"
      ),
  ),
);

/** Auth */
const SignUpPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Auth/SignUpPage/SignUpPage")),
);
const SignedOutPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Auth/SignedOutPage/SignedOutPage")),
);
const SignInPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Auth/SignInPage/SignInPage")),
);

/** Profile */
const CreateAccountPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Auth/CreateAccountPage/CreateAccountPage")),
);
const ProfileAndApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import("../pages/ProfileAndApplicationsPage/ProfileAndApplicationsPage"),
  ),
);
const ProfilePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Profile/ProfilePage/ProfilePage")),
);
const ExperienceFormPage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Profile/ExperienceFormPage/ExperienceFormPage"),
  ),
);
const CareerTimelineAndRecruitmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Profile/CareerTimelineAndRecruitmentPage/CareerTimelineAndRecruitmentPage"
      ),
  ),
);
const NotificationsPage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Notifications/NotificationsPage/NotificationsPage"),
  ),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/BrowsePoolsPage/BrowsePoolsPage")),
);
const PoolAdvertisementPage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"),
  ),
);
const CreateApplicationPage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/CreateApplicationPage/CreateApplicationPage"),
  ),
);
const ApplicationLayout = React.lazy(() =>
  lazyRetry(() => import("../pages/Applications/ApplicationLayout")),
);
const ApplicationWelcomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage"
      ),
  ),
);
const ApplicationSelfDeclarationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage"
      ),
  ),
);
const ApplicationProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationProfilePage/ApplicationProfilePage"
      ),
  ),
);
const ApplicationCareerTimelineIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage"
      ),
  ),
);
const ApplicationCareerTimelinePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage"
      ),
  ),
);
const ApplicationCareerTimelineAddPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage"
      ),
  ),
);
const ApplicationCareerTimelineEditPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage"
      ),
  ),
);
const ApplicationEducationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationEducationPage/ApplicationEducationPage"
      ),
  ),
);
const ApplicationSkillsIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage"
      ),
  ),
);
const ApplicationSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage"
      ),
  ),
);
const ApplicationQuestionsIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage"
      ),
  ),
);
const ApplicationQuestionsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage"
      ),
  ),
);
const ApplicationReviewPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationReviewPage/ApplicationReviewPage"
      ),
  ),
);
const ApplicationSuccessPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage"
      ),
  ),
);

/** IAP Home Page */
const IAPHomePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Home/IAPHomePage/Home")),
);
const IAPManagerHomePage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Home/IAPManagerHomePage/IAPManagerHomePage"),
  ),
);

/** Admin */
const AdminErrorPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Errors/AdminErrorPage/AdminErrorPage")),
);
const AdminDashboardPage = React.lazy(() =>
  lazyRetry(() => import("../pages/AdminDashboardPage/AdminDashboardPage")),
);

/** Users */
const IndexUserPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Users/IndexUserPage/IndexUserPage")),
);
const UserLayout = React.lazy(() =>
  lazyRetry(() => import("../pages/Users/UserLayout")),
);
const UpdateUserPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Users/UpdateUserPage/UpdateUserPage")),
);
const AdminUserProfilePage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Users/AdminUserProfilePage/AdminUserProfilePage"),
  ),
);
const UserInformationPage = React.lazy(() =>
  lazyRetry(
    () => import("../pages/Users/UserInformationPage/UserInformationPage"),
  ),
);

/** Teams */
const IndexTeamPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/IndexTeamPage/IndexTeamPage")),
);
const CreateTeamPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/CreateTeamPage/CreateTeamPage")),
);
const TeamLayout = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/TeamLayout")),
);
const ViewTeamPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/ViewTeamPage/ViewTeamPage")),
);
const UpdateTeamPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/UpdateTeamPage/UpdateTeamPage")),
);
const TeamMembersPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Teams/TeamMembersPage/TeamMembersPage")),
);

/** Classifications */
const IndexClassificationPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Classifications/IndexClassificationPage")),
);
const CreateClassificationPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Classifications/CreateClassificationPage")),
);
const UpdateClassificationPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Classifications/UpdateClassificationPage")),
);

/** Pool Candidates */
const AllPoolCandidatesPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage"
      ),
  ),
);
const IndexPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage"
      ),
  ),
);
const ViewPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage"
      ),
  ),
);

/** Pools */
const IndexPoolPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/IndexPoolPage/IndexPoolPage")),
);
const CreatePoolPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/CreatePoolPage/CreatePoolPage")),
);
const EditPoolPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/EditPoolPage/EditPoolPage")),
);
const AssessmentPlanBuilderPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage"
      ),
  ),
);
const PoolLayout = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/PoolLayout")),
);
const ViewPoolPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Pools/ViewPoolPage/ViewPoolPage")),
);

/** Departments */
const IndexDepartmentPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Departments/IndexDepartmentPage")),
);
const CreateDepartmentPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Departments/CreateDepartmentPage")),
);
const UpdateDepartmentPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Departments/UpdateDepartmentPage")),
);

/** Skill Families */
const IndexSkillFamilyPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SkillFamilies/IndexSkillFamilyPage")),
);
const CreateSkillFamilyPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SkillFamilies/CreateSkillFamilyPage")),
);
const UpdateSkillFamilyPage = React.lazy(() =>
  lazyRetry(() => import("../pages/SkillFamilies/UpdateSkillFamilyPage")),
);

/** Skills */
const IndexSkillPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/IndexSkillPage")),
);
const CreateSkillPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/CreateSkillPage")),
);
const UpdateSkillPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/UpdateSkillPage")),
);
const SkillLibraryPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/SkillLibraryPage")),
);
const UpdateUserSkillPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/UpdateUserSkillPage")),
);
const SkillShowcasePage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/SkillShowcasePage")),
);
const TopBehaviouralSkillsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/TopBehaviouralSkillsPage")),
);
const TopTechnicalSkillsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/TopTechnicalSkillsPage")),
);
const ImproveBehaviouralSkillsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/ImproveBehaviouralSkillsPage")),
);
const ImproveTechnicalSkillsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/ImproveTechnicalSkillsPage")),
);

/** Search Requests */
const IndexSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage"
      ),
  ),
);
const ViewSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage"
      ),
  ),
);

/** Announcements */
const AnnouncementsPage = React.lazy(() =>
  lazyRetry(() => import("../pages/AnnouncementsPage/AnnouncementsPage")),
);

/** Directive on Digital Talent */
const DirectivePage = React.lazy(() =>
  lazyRetry(() => import("../pages/DirectivePage/DirectivePage")),
);
const DigitalServicesContractingQuestionnaire = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        "../pages/DirectiveForms/DigitalServicesContractingQuestionnaire/DigitalServicesContractingQuestionnairePage"
      ),
  ),
);
const SkillPage = React.lazy(() =>
  lazyRetry(() => import("../pages/Skills/SkillPage")),
);

const createRoute = (
  locale: Locales,
  loginPath: string,
  featureFlags: FeatureFlags,
) =>
  createBrowserRouter([
    {
      path: `/`,
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: locale,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "executive",
              element: <ExecutiveHomePage />,
            },
            {
              path: "manager",
              element: <ManagerHomePage />,
            },
            {
              path: "support",
              element: <SupportPage />,
            },
            {
              path: "terms-and-conditions",
              element: <TermsAndConditions />,
            },
            {
              path: "privacy-policy",
              element: <PrivacyPolicy />,
            },
            {
              path: "accessibility-statement",
              element: <AccessibilityPage />,
            },
            {
              path: "directive-on-digital-talent",
              children: [
                {
                  index: true,
                  element: <DirectivePage />,
                },
                {
                  path: "digital-services-contracting-questionnaire",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.PlatformAdmin]}
                      loginPath={loginPath}
                    >
                      <DigitalServicesContractingQuestionnaire />
                    </RequireAuth>
                  ),
                },
              ],
            },
            {
              path: "search",
              children: [
                {
                  index: true,
                  element: <SearchPage />,
                },
                {
                  path: "request",
                  children: [
                    {
                      index: true,
                      element: <RequestPage />,
                    },
                    {
                      path: ":requestId",
                      element: <RequestConfirmationPage />,
                    },
                  ],
                },
              ],
            },
            {
              path: "skills",
              element: <SkillPage />,
            },
            {
              path: "register-info",
              element: <SignUpPage />,
            },
            {
              path: "logged-out",
              loader: async () => {
                const overridePath = sessionStorage.getItem(
                  POST_LOGOUT_OVERRIDE_PATH_KEY,
                );
                if (overridePath) {
                  sessionStorage.removeItem(POST_LOGOUT_OVERRIDE_PATH_KEY);
                  if (overridePath.startsWith("/")) {
                    window.location.href = overridePath; // do a hard redirect here because redirectUri may exist in another router entrypoint (eg admin)
                    return null;
                  }
                  defaultLogger.warning(
                    `Retrieved an unsafe uri from POST_LOGOUT_URI: ${overridePath}`,
                  );
                }
                return null;
              },
              element: <SignedOutPage />,
            },
            {
              path: "login-info",
              element: <SignInPage />,
            },
            {
              path: "create-account",
              element: (
                <RequireAuth
                  roles={[ROLE_NAME.Applicant]}
                  loginPath={loginPath}
                >
                  <CreateAccountPage />
                </RequireAuth>
              ),
            },
            {
              path: "applicant",
              element: <CreateAccountRedirect />,
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.Applicant]}
                      loginPath={loginPath}
                    >
                      <Outlet />
                    </RequireAuth>
                  ),
                },
                {
                  ...(featureFlags.notifications && {
                    path: "notifications",
                    element: (
                      <RequireAuth
                        roles={[ROLE_NAME.Applicant]}
                        loginPath={loginPath}
                      >
                        <NotificationsPage />
                      </RequireAuth>
                    ),
                  }),
                },
                {
                  path: "profile-and-applications",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.Applicant]}
                          loginPath={loginPath}
                        >
                          <ProfileAndApplicationsPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.Applicant]}
                              loginPath={loginPath}
                            >
                              <SkillLibraryPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: ":skillId",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.Applicant]}
                              loginPath={loginPath}
                            >
                              <UpdateUserSkillPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "showcase",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <SkillShowcasePage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "top-5-behavioural-skills",
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <TopBehaviouralSkillsPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "top-10-technical-skills",
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <TopTechnicalSkillsPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "3-behavioural-skills-to-improve",
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <ImproveBehaviouralSkillsPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "5-technical-skills-to-train",
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <ImproveTechnicalSkillsPage />
                                </RequireAuth>
                              ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "users",
              // Redirect any route in this section to /create-account
              // if no email is set
              element: <CreateAccountRedirect />,
              children: [
                {
                  path: "me",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.Applicant]}
                      loginPath={loginPath}
                    >
                      <ProfileRedirect />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  children: [
                    {
                      path: "personal-information",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.Applicant]}
                              loginPath={loginPath}
                            >
                              <ProfilePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "career-timeline",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <CareerTimelineAndRecruitmentPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "create",
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <ExperienceFormPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: ":experienceId",
                              children: [
                                {
                                  path: "edit",
                                  element: (
                                    <RequireAuth
                                      roles={[ROLE_NAME.Applicant]}
                                      loginPath={loginPath}
                                    >
                                      <ExperienceFormPage edit />
                                    </RequireAuth>
                                  ),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "browse",
              children: [
                {
                  path: "pools",
                  children: [
                    {
                      index: true,
                      element: <BrowsePoolsPage />,
                    },
                    {
                      path: ":poolId",
                      children: [
                        {
                          index: true,
                          element: <PoolAdvertisementPage />,
                        },
                        {
                          path: "create-application",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.Applicant]}
                              loginPath={loginPath}
                            >
                              <CreateApplicationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "applications",
              children: [
                {
                  path: ":applicationId",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.Applicant]}
                      loginPath={loginPath}
                    >
                      <ApplicationLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      path: "welcome",
                      element: <ApplicationWelcomePage />,
                    },
                    {
                      path: "self-declaration",
                      element: <ApplicationSelfDeclarationPage />,
                    },
                    {
                      path: "profile",
                      element: <ApplicationProfilePage />,
                    },
                    {
                      path: "career-timeline",
                      children: [
                        {
                          index: true,
                          element: <ApplicationCareerTimelinePage />,
                        },
                        {
                          path: "introduction",
                          element: (
                            <ApplicationCareerTimelineIntroductionPage />
                          ),
                        },
                        {
                          path: "add",
                          element: <ApplicationCareerTimelineAddPage />,
                        },
                        {
                          path: ":experienceId",
                          element: <ApplicationCareerTimelineEditPage />,
                        },
                      ],
                    },
                    {
                      path: "education",
                      element: <ApplicationEducationPage />,
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          element: <ApplicationSkillsPage />,
                        },
                        {
                          path: "introduction",
                          element: <ApplicationSkillsIntroductionPage />,
                        },
                      ],
                    },
                    {
                      path: "questions",
                      children: [
                        {
                          index: true,
                          element: <ApplicationQuestionsPage />,
                        },
                        {
                          path: "introduction",
                          element: <ApplicationQuestionsIntroductionPage />,
                        },
                      ],
                    },
                    {
                      path: "review",
                      element: <ApplicationReviewPage />,
                    },
                    {
                      path: "success",
                      element: <ApplicationSuccessPage />,
                    },
                  ],
                },
              ],
            },
            {
              path: "talent/profile/*",
              element: (
                <RequireAuth
                  roles={[ROLE_NAME.Applicant]}
                  loginPath={loginPath}
                >
                  <TalentRedirect />
                </RequireAuth>
              ),
            },
            {
              path: "*",
              loader: () => {
                throw new Response("Not Found", { status: 404 });
              },
            },
          ],
        },
        {
          path: "*",
          loader: () => {
            throw new Response("Not Found", { status: 404 });
          },
        },
      ],
    },
    {
      path: `${locale}/admin`,
      element: <AdminLayout />,
      errorElement: <AdminErrorPage />,
      children: [
        {
          errorElement: <AdminErrorPage />,
          children: [
            {
              index: true,
              element: (
                <RequireAuth
                  roles={[
                    ROLE_NAME.PoolOperator,
                    ROLE_NAME.RequestResponder,
                    ROLE_NAME.CommunityManager,
                    ROLE_NAME.PlatformAdmin,
                  ]}
                  loginPath={loginPath}
                >
                  <AdminDashboardPage />
                </RequireAuth>
              ),
            },
            {
              path: "users",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.RequestResponder,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <IndexUserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.RequestResponder,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <UserLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.RequestResponder,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <UserInformationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "profile",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.RequestResponder,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <AdminUserProfilePage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <UpdateUserPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "teams",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.CommunityManager,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <IndexTeamPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.CommunityManager,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <CreateTeamPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":teamId",
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.CommunityManager,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <TeamLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <ViewTeamPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <UpdateTeamPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "members",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <TeamMembersPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "pools",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.CommunityManager,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <IndexPoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.PoolOperator]}
                      loginPath={loginPath}
                    >
                      <CreatePoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":poolId",
                  element: (
                    <RequireAuth
                      roles={[
                        ROLE_NAME.PoolOperator,
                        ROLE_NAME.RequestResponder,
                        ROLE_NAME.CommunityManager,
                        ROLE_NAME.PlatformAdmin,
                      ]}
                      loginPath={loginPath}
                    >
                      <PoolLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.RequestResponder,
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <ViewPoolPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <EditPoolPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "pool-candidates",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[
                                ROLE_NAME.PoolOperator,
                                ROLE_NAME.RequestResponder,
                              ]}
                              loginPath={loginPath}
                            >
                              <IndexPoolCandidatePage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                    {
                      path: "screening",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <ScreeningAndEvaluationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "plan",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.CommunityManager,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <AssessmentPlanBuilderPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "pool-candidates",
              element: (
                <RequireAuth
                  roles={[
                    ROLE_NAME.PoolOperator,
                    ROLE_NAME.RequestResponder,
                    ROLE_NAME.PlatformAdmin,
                  ]}
                  loginPath={loginPath}
                >
                  <AllPoolCandidatesPage />
                </RequireAuth>
              ),
            },
            {
              path: "candidates/:poolCandidateId/application",
              element: (
                <RequireAuth
                  roles={[
                    ROLE_NAME.PoolOperator,
                    ROLE_NAME.RequestResponder,
                    ROLE_NAME.PlatformAdmin,
                  ]}
                  loginPath={loginPath}
                >
                  <ViewPoolCandidatePage />
                </RequireAuth>
              ),
            },
            {
              path: "talent-requests",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.RequestResponder]}
                      loginPath={loginPath}
                    >
                      <IndexSearchRequestPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":searchRequestId",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.RequestResponder]}
                      loginPath={loginPath}
                    >
                      <ViewSearchRequestPage />
                    </RequireAuth>
                  ),
                },
              ],
            },
            {
              path: "settings",
              children: [
                {
                  path: "classifications",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <IndexClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <CreateClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":classificationId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.PlatformAdmin]}
                              loginPath={loginPath}
                            >
                              <UpdateClassificationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "departments",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <IndexDepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <CreateDepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":departmentId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.PlatformAdmin]}
                              loginPath={loginPath}
                            >
                              <UpdateDepartmentPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "skills",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <IndexSkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <CreateSkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":skillId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.PlatformAdmin]}
                              loginPath={loginPath}
                            >
                              <UpdateSkillPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "skill-families",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <IndexSkillFamilyPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.PlatformAdmin]}
                          loginPath={loginPath}
                        >
                          <CreateSkillFamilyPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":skillFamilyId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[ROLE_NAME.PlatformAdmin]}
                              loginPath={loginPath}
                            >
                              <UpdateSkillFamilyPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "announcements",
                  element: (
                    <RequireAuth
                      roles={[ROLE_NAME.PlatformAdmin]}
                      loginPath={loginPath}
                    >
                      <AnnouncementsPage />
                    </RequireAuth>
                  ),
                },
              ],
            },
            {
              path: "*",
              loader: () => {
                throw new Response("Not Found", { status: 404 });
              },
            },
          ],
        },
      ],
    },
    {
      path: `${locale}/indigenous-it-apprentice`,
      element: <IAPLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <IAPHomePage />,
        },
        {
          path: "hire",
          element: <IAPManagerHomePage />,
        },
        {
          path: "*",
          loader: () => {
            throw new Response("Not Found", { status: 404 });
          },
        },
      ],
    },
  ]);

const Router = () => {
  const { locale } = useLocale();
  const routes = useRoutes();
  const featureFlags = useFeatureFlags();
  const router = createRoute(locale, routes.login(), featureFlags);
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Loading />}
      // Note: This is required for turning on a version 7 feature flag in react-router: https://reactrouter.com/en/main/routers/router-provider#future
      // eslint-disable-next-line camelcase
      future={{ v7_startTransition: true }}
    />
  );
};

export default Router;
