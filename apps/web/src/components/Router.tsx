import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import {
  RequireAuth,
  POST_LOGOUT_URI_KEY,
  ROLE_NAME,
} from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { lazyRetry } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import Layout from "~/components/Layout/Layout";
import AdminLayout from "~/components/Layout/AdminLayout";
import IAPLayout from "~/components/Layout/IAPLayout";
import { TalentRedirect, ProfileRedirect } from "~/components/Redirects";
import CreateAccountRedirect from "~/pages/Auth/CreateAccountPage/CreateAccountRedirect";
import useRoutes from "~/hooks/useRoutes";

/** Home */
const HomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsHomePage" */ "../pages/Home/HomePage/HomePage"
      ),
  ),
);
const ExecutiveHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsExecutiveHomePage" */ "../pages/Home/ExecutiveHomePage/ExecutiveHomePage"
      ),
  ),
);
const ManagerHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsManagerHomePage" */ "../pages/Home/ManagerHomePage/ManagerHomePage"
      ),
  ),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsErrorPage" */ "../pages/Errors/ErrorPage/ErrorPage"
      ),
  ),
);
const SupportPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSupportPage" */ "../pages/SupportPage/SupportPage"
      ),
  ),
);
const AccessibilityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsAccessibilityPage" */ "../pages/AccessibilityStatementPage/AccessibilityStatementPage"
      ),
  ),
);
const DirectivePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsDirectivePage" */ "../pages/DirectivePage/DirectivePage"
      ),
  ),
);

/** Search */
const SearchPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSearchPage" */ "../pages/SearchRequests/SearchPage/SearchPage"
      ),
  ),
);
const RequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRequestPage" */ "../pages/SearchRequests/RequestPage/RequestPage"
      ),
  ),
);
const RequestConfirmationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRequestConfirmationPage" */ "../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage"
      ),
  ),
);

/** Auth */
const SignUpPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSignUpPage" */ "../pages/Auth/SignUpPage/SignUpPage"
      ),
  ),
);
const SignedOutPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSignedOutPage" */ "../pages/Auth/SignedOutPage/SignedOutPage"
      ),
  ),
);
const SignInPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSignInPage" */ "../pages/Auth/SignInPage/SignInPage"
      ),
  ),
);

/** Profile */
const CreateAccountPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateAccountPage" */ "../pages/Auth/CreateAccountPage/CreateAccountPage"
      ),
  ),
);
const ProfileAndApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsProfileAndApplicationsPage" */ "../pages/ProfileAndApplicationsPage/ProfileAndApplicationsPage"
      ),
  ),
);
const ProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsProfilePage" */ "../pages/Profile/ProfilePage/ProfilePage"
      ),
  ),
);
const CareerTimelineAndRecruitmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCareerTimelineAndRecruitmentPage" */ "../pages/Profile/CareerTimelineAndRecruitmentPage/CareerTimelineAndRecruitmentPage"
      ),
  ),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsBrowsePoolsPage" */ "../pages/Pools/BrowsePoolsPage/BrowsePoolsPage"
      ),
  ),
);
const PoolAdvertisementPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsPoolAdvertPage" */ "../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"
      ),
  ),
);
const CreateApplicationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateApplicationPage" */ "../pages/CreateApplicationPage/CreateApplicationPage"
      ),
  ),
);
const MyApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsMyApplicationsPage" */ "../pages/Applications/MyApplicationsPage/MyApplicationsPage"
      ),
  ),
);
const ApplicationLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationLayout" */ "../pages/Applications/ApplicationLayout"
      ),
  ),
);
const ApplicationWelcomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationWelcomePage" */ "../pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage"
      ),
  ),
);
const ApplicationSelfDeclarationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationSelfDeclarationPage" */ "../pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage"
      ),
  ),
);
const ApplicationProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationProfilePage" */ "../pages/Applications/ApplicationProfilePage/ApplicationProfilePage"
      ),
  ),
);
const ApplicationCareerTimelineIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationCareerTimelineIntroductionPage" */ "../pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage"
      ),
  ),
);
const ApplicationCareerTimelinePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationCareerTimelinePage" */ "../pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage"
      ),
  ),
);
const ApplicationCareerTimelineAddPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationCareerTimelineAddPage" */ "../pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage"
      ),
  ),
);
const ApplicationCareerTimelineEditPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationCareerTimelineEditPage" */ "../pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage"
      ),
  ),
);
const ApplicationEducationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationEducationPage" */ "../pages/Applications/ApplicationEducationPage/ApplicationEducationPage"
      ),
  ),
);
const ApplicationSkillsIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationSkillsIntroductionPage" */ "../pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage"
      ),
  ),
);
const ApplicationSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationSkillsPage" */ "../pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage"
      ),
  ),
);
const ApplicationQuestionsIntroductionPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationQuestionsIntroductionPage" */ "../pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage"
      ),
  ),
);
const ApplicationQuestionsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationQuestionsPage" */ "../pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage"
      ),
  ),
);
const ApplicationReviewPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationReviewPage" */ "../pages/Applications/ApplicationReviewPage/ApplicationReviewPage"
      ),
  ),
);
const ApplicationSuccessPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsApplicationSuccessPage" */ "../pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage"
      ),
  ),
);

/** IAP Home Page */
const IAPHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "iapHomePage" */ "../pages/Home/IAPHomePage/Home"
      ),
  ),
);

/** Admin */
const AdminHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminHomePage" */ "../pages/Home/AdminHomePage/AdminHomePage"
      ),
  ),
);
const AdminErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminErrorPage" */ "../pages/Errors/AdminErrorPage/AdminErrorPage"
      ),
  ),
);
const AdminDashboardPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminDashboardPage" */ "../pages/AdminDashboardPage/AdminDashboardPage"
      ),
  ),
);

/** Users */
const IndexUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexUserPage" */ "../pages/Users/IndexUserPage/IndexUserPage"
      ),
  ),
);
const UserLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUserLayout" */ "../pages/Users/UserLayout"
      ),
  ),
);
const UpdateUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateUserPage" */ "../pages/Users/UpdateUserPage/UpdateUserPage"
      ),
  ),
);
const AdminUserProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminUserProfilePage" */ "../pages/Users/AdminUserProfilePage/AdminUserProfilePage"
      ),
  ),
);
const UserInformationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUserInformationPage" */ "../pages/Users/UserInformationPage/UserInformationPage"
      ),
  ),
);

const UserPlacementPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUserPlacementPage" */ "../pages/Users/UserPlacementPage/UserPlacementPage"
      ),
  ),
);

/** Teams */
const IndexTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexTeamPage" */ "../pages/Teams/IndexTeamPage/IndexTeamPage"
      ),
  ),
);
const CreateTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateTeamPage" */ "../pages/Teams/CreateTeamPage/CreateTeamPage"
      ),
  ),
);
const TeamLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminTeamLayout" */ "../pages/Teams/TeamLayout"
      ),
  ),
);
const ViewTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewTeamPage" */ "../pages/Teams/ViewTeamPage/ViewTeamPage"
      ),
  ),
);
const UpdateTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateTeamPage" */ "../pages/Teams/UpdateTeamPage/UpdateTeamPage"
      ),
  ),
);
const TeamMembersPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminTeamMembersPage" */ "../pages/Teams/TeamMembersPage/TeamMembersPage"
      ),
  ),
);

/** Classifications */
const IndexClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexClassificationPage" */ "../pages/Classifications/IndexClassificationPage"
      ),
  ),
);
const CreateClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateClassificationPage" */ "../pages/Classifications/CreateClassificationPage"
      ),
  ),
);
const UpdateClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateClassificationPage" */ "../pages/Classifications/UpdateClassificationPage"
      ),
  ),
);

/** Pool Candidates */
const IndexPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexPoolCandidatePage" */ "../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage"
      ),
  ),
);
const ViewPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewPoolCandidate" */ "../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage"
      ),
  ),
);

/** Pools */
const IndexPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexPoolPage" */ "../pages/Pools/IndexPoolPage/IndexPoolPage"
      ),
  ),
);
const CreatePoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreatePoolPage" */ "../pages/Pools/CreatePoolPage/CreatePoolPage"
      ),
  ),
);
const EditPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminEditPoolPage" */ "../pages/Pools/EditPoolPage/EditPoolPage"
      ),
  ),
);
const PoolLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminPoolLayout" */ "../pages/Pools/PoolLayout"
      ),
  ),
);
const ViewPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewPoolPage" */ "../pages/Pools/ViewPoolPage/ViewPoolPage"
      ),
  ),
);

/** Departments */
const IndexDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexDepartmentPage" */ "../pages/Departments/IndexDepartmentPage"
      ),
  ),
);
const CreateDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateDepartmentPage" */ "../pages/Departments/CreateDepartmentPage"
      ),
  ),
);
const UpdateDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateDepartmentPage" */ "../pages/Departments/UpdateDepartmentPage"
      ),
  ),
);

/** Skill Families */
const IndexSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSkillFamilyPage" */ "../pages/SkillFamilies/IndexSkillFamilyPage"
      ),
  ),
);
const CreateSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateSkillFamilyPage" */ "../pages/SkillFamilies/CreateSkillFamilyPage"
      ),
  ),
);
const UpdateSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateSkillFamilyPage" */ "../pages/SkillFamilies/UpdateSkillFamilyPage"
      ),
  ),
);

/** Skills */
const IndexSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSkillPage" */ "../pages/Skills/IndexSkillPage"
      ),
  ),
);
const CreateSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateSkillPage" */ "../pages/Skills/CreateSkillPage"
      ),
  ),
);
const UpdateSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateSkillPage" */ "../pages/Skills/UpdateSkillPage"
      ),
  ),
);

/** Search Requests */
const IndexSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSearchRequestPage" */ "../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage"
      ),
  ),
);
const ViewSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewSearchRequestPage" */ "../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage"
      ),
  ),
);

const createRoute = (locale: Locales, loginPath: string) =>
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
              path: "accessibility-statement",
              element: <AccessibilityPage />,
            },
            {
              path: "directive-on-digital-talent",
              element: <DirectivePage />,
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
              path: "register-info",
              element: <SignUpPage />,
            },
            {
              path: "logged-out",
              loader: async () => {
                const redirectUri = sessionStorage.getItem(POST_LOGOUT_URI_KEY);
                if (redirectUri) {
                  sessionStorage.removeItem(POST_LOGOUT_URI_KEY);
                  if (redirectUri.startsWith("/")) {
                    window.location.href = redirectUri; // do a hard redirect here because redirectUri may exist in another router entrypoint (eg admin)
                    return null;
                  }
                  defaultLogger.warning(
                    `Retrieved an unsafe uri from POST_LOGOUT_URI: ${redirectUri}`,
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
                  path: "profile-and-applications",
                  element: <ProfileAndApplicationsPage />,
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
                      path: "profile",
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
                          path: "career-timeline-and-recruitment",
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
                          ],
                        },
                      ],
                    },
                    {
                      path: "applications",
                      element: (
                        <RequireAuth
                          roles={[ROLE_NAME.Applicant]}
                          loginPath={loginPath}
                        >
                          <MyApplicationsPage />
                        </RequireAuth>
                      ),
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
              path: "",
              element: <AdminHomePage />,
            },
            {
              path: "dashboard",
              element: (
                <RequireAuth
                  roles={[
                    ROLE_NAME.PoolOperator,
                    ROLE_NAME.RequestResponder,
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
                      roles={[ROLE_NAME.PlatformAdmin]}
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
                      path: "placement",
                      element: (
                        <RequireAuth
                          roles={[
                            ROLE_NAME.PoolOperator,
                            ROLE_NAME.RequestResponder,
                            ROLE_NAME.PlatformAdmin,
                          ]}
                          loginPath={loginPath}
                        >
                          <UserPlacementPage />
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
                      roles={[ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin]}
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
                      roles={[ROLE_NAME.PlatformAdmin]}
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
                      roles={[ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin]}
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
                          roles={[ROLE_NAME.PlatformAdmin]}
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
                      roles={[ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin]}
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
                        {
                          path: ":poolCandidateId",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth
                                  roles={[ROLE_NAME.PoolOperator]}
                                  loginPath={loginPath}
                                >
                                  <ViewPoolCandidatePage />
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
              path: "candidates/:poolCandidateId/application",
              element: (
                <RequireAuth
                  roles={[ROLE_NAME.PoolOperator]}
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
                    {
                      path: "families",
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
                  ],
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
  const router = createRoute(locale, routes.login());
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Loading />}
      future={{ v7_startTransition: true }}
    />
  );
};

export default Router;
