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
              lazy: () => import("../pages/Skills/SkillPage"),
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
                      lazy: () => import("../pages/Skills/SkillLibraryPage"),
                    },
                    {
                      path: ":skillId",
                      lazy: () => import("../pages/Skills/UpdateUserSkillPage"),
                    },
                    {
                      path: "showcase",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Skills/SkillShowcasePage"),
                        },
                        {
                          path: "top-5-behavioural-skills",
                          lazy: () =>
                            import("../pages/Skills/TopBehaviouralSkillsPage"),
                        },
                        {
                          path: "top-10-technical-skills",
                          lazy: () =>
                            import("../pages/Skills/TopTechnicalSkillsPage"),
                        },
                        {
                          path: "3-behavioural-skills-to-improve",
                          lazy: () =>
                            import(
                              "../pages/Skills/ImproveBehaviouralSkillsPage"
                            ),
                        },
                        {
                          path: "5-technical-skills-to-train",
                          lazy: () =>
                            import(
                              "../pages/Skills/ImproveTechnicalSkillsPage"
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
                  lazy: () =>
                    import("../pages/Pools/IndexPoolPage/IndexPoolPage"),
                },
                {
                  path: "create",
                  lazy: () =>
                    import("../pages/Pools/CreatePoolPage/CreatePoolPage"),
                },
                {
                  path: ":poolId",
                  lazy: () => import("../pages/Pools/PoolLayout"),
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Pools/ViewPoolPage/ViewPoolPage"),
                    },
                    {
                      path: "edit",
                      lazy: () =>
                        import("../pages/Pools/EditPoolPage/EditPoolPage"),
                    },
                    {
                      path: "pool-candidates",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage"
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
                      lazy: () =>
                        import(
                          "../pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "pool-candidates",
              lazy: () =>
                import(
                  "../pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage"
                ),
            },
            {
              path: "candidates/:poolCandidateId/application",
              lazy: () =>
                import(
                  "../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage"
                ),
            },
            {
              path: "talent-requests",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import(
                      "../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage"
                    ),
                },
                {
                  path: ":searchRequestId",
                  lazy: () =>
                    import(
                      "../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage"
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
                      lazy: () =>
                        import(
                          "../pages/Classifications/IndexClassificationPage"
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../pages/Classifications/CreateClassificationPage"
                        ),
                    },
                    {
                      path: ":classificationId",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/Classifications/UpdateClassificationPage"
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
                      lazy: () =>
                        import("../pages/Departments/IndexDepartmentPage"),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/Departments/CreateDepartmentPage"),
                    },
                    {
                      path: ":departmentId",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/Departments/UpdateDepartmentPage"),
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
                      lazy: () => import("../pages/Skills/IndexSkillPage"),
                    },
                    {
                      path: "create",
                      lazy: () => import("../pages/Skills/CreateSkillPage"),
                    },
                    {
                      path: ":skillId",
                      children: [
                        {
                          path: "edit",
                          lazy: () => import("../pages/Skills/UpdateSkillPage"),
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
                      lazy: () =>
                        import("../pages/SkillFamilies/IndexSkillFamilyPage"),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/SkillFamilies/CreateSkillFamilyPage"),
                    },
                    {
                      path: ":skillFamilyId",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/SkillFamilies/UpdateSkillFamilyPage"
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
