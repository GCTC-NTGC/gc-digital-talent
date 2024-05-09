import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import {
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  ROLE_NAME,
} from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { lazyRetry } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import Layout from "~/components/Layout/Layout";
import AdminLayout from "~/components/Layout/AdminLayout/AdminLayout";
import IAPLayout from "~/components/Layout/IAPLayout";
import CreateAccountRedirect from "~/pages/Auth/CreateAccountPage/CreateAccountRedirect";
import useRoutes from "~/hooks/useRoutes";
import ScreeningAndEvaluationPage from "~/pages/Pools/ScreeningAndEvaluationPage/ScreeningAndEvaluationPage";

import RequireAuth from "./RequireAuth/RequireAuth";

const ErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsErrorPage" */ "../pages/Errors/ErrorPage/ErrorPage"
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
const AllPoolCandidatesPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAllPoolCandidatesPage" */ "../pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage"
      ),
  ),
);
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
const AssessmentPlanBuilderPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAssessmentPlanBuilderPage" */ "../pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage"
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
const SkillLibraryPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSkillLibraryPage" */ "../pages/Skills/SkillLibraryPage"
      ),
  ),
);
const UpdateUserSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsUpdateUserSkillPage" */ "../pages/Skills/UpdateUserSkillPage"
      ),
  ),
);
const SkillShowcasePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSkillShowcasePage" */ "../pages/Skills/SkillShowcasePage"
      ),
  ),
);
const TopBehaviouralSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsTopBehaviouralSkillsPage" */ "../pages/Skills/TopBehaviouralSkillsPage"
      ),
  ),
);
const TopTechnicalSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsTopTechnicalSkillsPage" */ "../pages/Skills/TopTechnicalSkillsPage"
      ),
  ),
);
const ImproveBehaviouralSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsImproveBehaviouralSkillsPage" */ "../pages/Skills/ImproveBehaviouralSkillsPage"
      ),
  ),
);
const ImproveTechnicalSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsImproveTechnicalSkillsPage" */ "../pages/Skills/ImproveTechnicalSkillsPage"
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

/** Announcements */
const AnnouncementsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAnnouncementsPage" */ "../pages/AnnouncementsPage/AnnouncementsPage"
      ),
  ),
);

/** Directive on Digital Talent */
const DirectivePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsDirectivePage" */ "../pages/DirectivePage/DirectivePage"
      ),
  ),
);
const DigitalServicesContractingQuestionnaire = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsDirectiveDigitalServicesContractingQuestionnaire" */ "../pages/DirectiveForms/DigitalServicesContractingQuestionnaire/DigitalServicesContractingQuestionnairePage"
      ),
  ),
);
const SkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "tsSkillPage" */ "../pages/Skills/SkillPage"),
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
              lazy: () => import("../pages/Home/HomePage/HomePage"),
            },
            {
              path: "executive",
              lazy: () =>
                import("../pages/Home/ExecutiveHomePage/ExecutiveHomePage"),
            },
            {
              path: "manager",
              lazy: () =>
                import("../pages/Home/ManagerHomePage/ManagerHomePage"),
            },
            {
              path: "support",
              lazy: () => import("../pages/SupportPage/SupportPage"),
            },
            {
              path: "terms-and-conditions",
              lazy: () =>
                import("../pages/TermsAndConditions/TermsAndConditions"),
            },
            {
              path: "privacy-policy",
              lazy: () => import("../pages/PrivacyPolicy/PrivacyPolicy"),
            },
            {
              path: "accessibility-statement",
              lazy: () =>
                import(
                  "../pages/AccessibilityStatementPage/AccessibilityStatementPage"
                ),
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
                  lazy: () =>
                    import("../pages/SearchRequests/SearchPage/SearchPage"),
                },
                {
                  path: "request",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/SearchRequests/RequestPage/RequestPage"
                        ),
                    },
                    {
                      path: ":requestId",
                      lazy: () =>
                        import(
                          "../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage"
                        ),
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
              lazy: () => import("../pages/Auth/SignUpPage/SignUpPage"),
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
              lazy: () => import("../pages/Auth/SignedOutPage/SignedOutPage"),
            },
            {
              path: "login-info",
              lazy: () => import("../pages/Auth/SignInPage/SignInPage"),
            },
            {
              path: "create-account",
              lazy: () =>
                import("../pages/Auth/CreateAccountPage/CreateAccountPage"),
            },
            {
              path: "applicant",
              element: <CreateAccountRedirect />,
              children: [
                {
                  index: true,
                  lazy: () =>
                    import(
                      "../pages/ProfileAndApplicationsPage/ProfileAndApplicationsPage"
                    ),
                },
                {
                  path: "settings",
                  lazy: () =>
                    import(
                      "../pages/Profile/AccountSettings/AccountSettingsPage"
                    ),
                },
                {
                  path: "notifications",
                  lazy: () =>
                    import(
                      "../pages/Notifications/NotificationsPage/NotificationsPage"
                    ),
                },
                {
                  path: "personal-information",
                  lazy: () =>
                    import("../pages/Profile/ProfilePage/ProfilePage"),
                },
                {
                  path: "career-timeline",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/Profile/CareerTimelineAndRecruitmentPage/CareerTimelineAndRecruitmentPage"
                        ),
                    },
                    {
                      path: "create",
                      async lazy() {
                        const { Create } = await import(
                          "../pages/Profile/ExperienceFormPage/ExperienceFormPage"
                        );

                        return { Component: Create };
                      },
                    },
                    {
                      path: ":experienceId",
                      children: [
                        {
                          path: "edit",
                          async lazy() {
                            const { Edit } = await import(
                              "../pages/Profile/ExperienceFormPage/ExperienceFormPage"
                            );

                            return { Component: Edit };
                          },
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
            {
              path: "browse",
              children: [
                {
                  path: "pools",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/Pools/BrowsePoolsPage/BrowsePoolsPage"
                        ),
                    },
                    {
                      path: ":poolId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"
                            ),
                        },
                        {
                          path: "create-application",
                          lazy: () =>
                            import(
                              "../pages/CreateApplicationPage/CreateApplicationPage"
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
                  lazy: () => import("../pages/Applications/ApplicationLayout"),
                  children: [
                    {
                      path: "welcome",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage"
                        ),
                    },
                    {
                      path: "self-declaration",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage"
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationProfilePage/ApplicationProfilePage"
                        ),
                    },
                    {
                      path: "career-timeline",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage"
                            ),
                        },
                        {
                          path: "add",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage"
                            ),
                        },
                        {
                          path: ":experienceId",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage"
                            ),
                        },
                      ],
                    },
                    {
                      path: "education",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationEducationPage/ApplicationEducationPage"
                        ),
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage"
                            ),
                        },
                      ],
                    },
                    {
                      path: "questions",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage"
                            ),
                        },
                      ],
                    },
                    {
                      path: "review",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationReviewPage/ApplicationReviewPage"
                        ),
                    },
                    {
                      path: "success",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage"
                        ),
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
              lazy: () =>
                import("../pages/AdminDashboardPage/AdminDashboardPage"),
            },
            {
              path: "users",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/Users/IndexUserPage/IndexUserPage"),
                },
                {
                  path: ":userId",
                  lazy: () => import("../pages/Users/UserLayout"),
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/Users/UserInformationPage/UserInformationPage"
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import(
                          "../pages/Users/AdminUserProfilePage/AdminUserProfilePage"
                        ),
                    },
                    {
                      path: "edit",
                      lazy: () =>
                        import("../pages/Users/UpdateUserPage/UpdateUserPage"),
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
                  lazy: () =>
                    import("../pages/Teams/IndexTeamPage/IndexTeamPage"),
                },
                {
                  path: "create",
                  lazy: () =>
                    import("../pages/Teams/CreateTeamPage/CreateTeamPage"),
                },
                {
                  path: ":teamId",
                  lazy: () => import("../pages/Teams/TeamLayout"),
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Teams/ViewTeamPage/ViewTeamPage"),
                    },
                    {
                      path: "edit",
                      lazy: () =>
                        import("../pages/Teams/UpdateTeamPage/UpdateTeamPage"),
                    },
                    {
                      path: "members",
                      lazy: () =>
                        import(
                          "../pages/Teams/TeamMembersPage/TeamMembersPage"
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
          lazy: () => import("../pages/Home/IAPHomePage/Home"),
        },
        {
          path: "hire",
          lazy: () =>
            import("../pages/Home/IAPManagerHomePage/IAPManagerHomePage"),
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
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const routes = useRoutes();
  const router = createRoute(locale, routes.login());
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
