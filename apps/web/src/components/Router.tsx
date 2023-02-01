import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales } from "@common/helpers/localize";
import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";
import useLocale from "@common/hooks/useLocale";
import lazyRetry from "@common/helpers/lazyRetry";
import { POST_LOGOUT_URI_KEY } from "@common/components/Auth/AuthenticationContainer";
import { defaultLogger } from "@common/hooks/useLogger";

import Layout from "~/components/Layout/Layout";
import AdminLayout from "~/components/Layout/AdminLayout";
import IAPLayout from "~/components/Layout/IAPLayout";
import { TalentRedirect, ProfileRedirect } from "~/components/Redirects";
import CreateAccountRedirect from "~/pages/CreateAccountPage/CreateAccountRedirect";
import { LegacyRole } from "~/api/generated";

/** Home */
const HomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsHomePage" */ "../pages/Home/HomePage/HomePage"
      ),
  ),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsErrorPage" */ "../pages/ErrorPage/ErrorPage"
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

/** Auth */
const RegisterPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRegisterPage" */ "../pages/RegisterPage/RegisterPage"
      ),
  ),
);
const LoggedOutPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoggedOutPage" */ "../pages/LoggedOutPage/LoggedOutPage"
      ),
  ),
);
const LoginPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoginPage" */ "../pages/LoginPage/LoginPage"
      ),
  ),
);

/** Profile */
const CreateAccountPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateAccountPage" */ "../pages/CreateAccountPage/CreateAccountPage"
      ),
  ),
);
const ProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsProfilePage" */ "../pages/ProfilePage/ProfilePage"
      ),
  ),
);
const GovernmentInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsGovInfoPage" */ "../pages/GovernmentInfoPage/GovernmentInfoPage"
      ),
  ),
);
const LanguageInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLangInfoPage" */ "../pages/LanguageInfoPage/LanguageInfoPage"
      ),
  ),
);
const WorkLocationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkLocationPage" */ "../pages/WorkLocationPage/WorkLocationPage"
      ),
  ),
);
const ExperienceFormPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEditExperiencePage" */ "../pages/ExperienceFormPage/ExperienceFormPage"
      ),
  ),
);
const WorkPreferencesPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkPrefPage" */ "../pages/WorkPreferencesPage/WorkPreferencesPage"
      ),
  ),
);
const AboutMePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsAboutMePage" */ "../pages/AboutMePage/AboutMePage"
      ),
  ),
);
const RoleSalaryPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRoleSalaryPage" */ "../pages/RoleSalaryPage/RoleSalaryPage"
      ),
  ),
);
const EmploymentEquityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEquityPage" */ "../pages/EmploymentEquityPage/EmploymentEquityPage"
      ),
  ),
);
const ExperienceAndSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsExperienceSkillsPage" */ "../pages/ExperienceAndSkillsPage/ExperienceAndSkillsPage"
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
const SignAndSubmitPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSignSubmitPage" */ "../pages/SignAndSubmitPage/SignAndSubmitPage"
      ),
  ),
);
const MyApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsMyApplicationsPage" */ "../pages/MyApplicationsPage/MyApplicationsPage"
      ),
  ),
);
const ReviewApplicationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsReviewApplicationPage" */ "../pages/ReviewApplicationPage/ReviewApplicationPage"
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
        /* webpackChunkName: "adminAdminErrorPage" */ "../pages/ErrorPage/AdminErrorPage"
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
const CreateUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateUserPage" */ "../pages/Users/CreateUserPage/CreateUserPage"
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
const ViewUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewUserPage" */ "../pages/Users/ViewUserPage/ViewUserPage"
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

const createRoute = (locale: Locales) =>
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
              path: "support",
              element: <SupportPage />,
            },
            {
              path: "accessibility-statement",
              element: <AccessibilityPage />,
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
                  element: <RequestPage />,
                },
              ],
            },
            {
              path: "register-info",
              element: <RegisterPage />,
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
              element: <LoggedOutPage />,
            },
            {
              path: "login-info",
              element: <LoginPage />,
            },
            {
              path: "create-account",
              element: (
                <RequireAuth roles={[LegacyRole.Applicant]}>
                  <CreateAccountPage />
                </RequireAuth>
              ),
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
                    <RequireAuth roles={[LegacyRole.Applicant]}>
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
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <ProfilePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "about-me/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <AboutMePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "government-info/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <GovernmentInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "language-info/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <LanguageInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-location/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <WorkLocationPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-preferences/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <WorkPreferencesPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "employment-equity/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <EmploymentEquityPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "role-salary-expectations/edit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <RoleSalaryPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "experiences",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth roles={[LegacyRole.Applicant]}>
                                  <ExperienceAndSkillsPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: ":experienceType",
                              children: [
                                {
                                  path: "create",
                                  element: (
                                    <RequireAuth roles={[LegacyRole.Applicant]}>
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
                                          roles={[LegacyRole.Applicant]}
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
                    {
                      path: "applications",
                      element: (
                        <RequireAuth roles={[LegacyRole.Applicant]}>
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
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <CreateApplicationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "applications",
                  children: [
                    {
                      path: ":poolCandidateId",
                      children: [
                        {
                          path: "submit",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <SignAndSubmitPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "apply",
                          element: (
                            <RequireAuth roles={[LegacyRole.Applicant]}>
                              <ReviewApplicationPage />
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
              path: "talent/profile/*",
              element: (
                <RequireAuth roles={[LegacyRole.Applicant]}>
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
                <RequireAuth roles={[LegacyRole.Admin]}>
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
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <IndexUserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <CreateUserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
                          <ViewUserPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
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
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <IndexTeamPage />
                    </RequireAuth>
                  ),
                },
                // {
                //   path: "create",
                //   element: (
                //     <RequireAuth roles={[LegacyRole.Admin]}>
                //       <CreateTeamPage />
                //     </RequireAuth>
                //   ),
                // },
                // {
                //   path: ":teamId",
                //   children: [
                //     {
                //       index: true,
                //       element: (
                //         <RequireAuth roles={[LegacyRole.Admin]}>
                //           <ViewTeamPage />
                //         </RequireAuth>
                //       ),
                //     },
                //     {
                //       path: "edit",
                //       element: (
                //         <RequireAuth roles={[LegacyRole.Admin]}>
                //           <UpdateTeamPage />
                //         </RequireAuth>
                //       ),
                //     },
                //   ],
                // },
              ],
            },
            {
              path: "pools",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <IndexPoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <CreatePoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":poolId",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
                          <ViewPoolPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
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
                            <RequireAuth roles={[LegacyRole.Admin]}>
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
                                <RequireAuth roles={[LegacyRole.Admin]}>
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
                <RequireAuth roles={[LegacyRole.Admin]}>
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
                    <RequireAuth roles={[LegacyRole.Admin]}>
                      <IndexSearchRequestPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":searchRequestId",
                  element: (
                    <RequireAuth roles={[LegacyRole.Admin]}>
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
                        <RequireAuth roles={[LegacyRole.Admin]}>
                          <IndexClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
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
                            <RequireAuth roles={[LegacyRole.Admin]}>
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
                        <RequireAuth roles={[LegacyRole.Admin]}>
                          <IndexDepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
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
                            <RequireAuth roles={[LegacyRole.Admin]}>
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
                        <RequireAuth roles={[LegacyRole.Admin]}>
                          <IndexSkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[LegacyRole.Admin]}>
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
                            <RequireAuth roles={[LegacyRole.Admin]}>
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
                            <RequireAuth roles={[LegacyRole.Admin]}>
                              <IndexSkillFamilyPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "create",
                          element: (
                            <RequireAuth roles={[LegacyRole.Admin]}>
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
                                <RequireAuth roles={[LegacyRole.Admin]}>
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
  const router = createRoute(locale);
  return <RouterProvider router={router} fallbackElement={<Loading />} />;
};

export default Router;
