import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import { POST_LOGOUT_OVERRIDE_PATH_KEY } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { defaultLogger } from "@gc-digital-talent/logger";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { FeatureFlags, useFeatureFlags } from "@gc-digital-talent/env";

import { urlMatchesAppHostName } from "~/utils/utils";
import { convert } from "~/utils/routeUtils";

import RootErrorBoundary from "./Layout/RouteErrorBoundary/RootErrorBoundary";

const createRoute = (locale: Locales, featureFlags: FeatureFlags) =>
  createBrowserRouter([
    {
      path: `/`,
      lazy: () => import("./Layout/MainLayout").then(convert),
      ErrorBoundary: RootErrorBoundary,
      HydrateFallback: Loading,
      children: [
        {
          path: locale,
          async lazy() {
            const { RouteErrorBoundary: ErrorBoundary } =
              await import("./Layout/RouteErrorBoundary/RouteErrorBoundary");
            return { ErrorBoundary };
          },
          children: [
            {
              path: "admin",
              children: [
                {
                  path: "talent-requests",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":searchRequestId",
                      lazy: () =>
                        import("../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage").then(
                          convert,
                        ),
                    },
                  ],
                },
                {
                  path: "training-opportunities",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TrainingOpportunities/IndexTrainingOpportunitiesPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/TrainingOpportunities/CreateTrainingOpportunityPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":trainingOpportunityId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/TrainingOpportunities/ViewTrainingOpportunityPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/TrainingOpportunities/UpdateTrainingOpportunityPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "settings",
                  children: [
                    {
                      index: true,
                      loader: () => {
                        throw new NotFoundError();
                      },
                    },
                    {
                      path: "classifications",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Classifications/IndexClassificationPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Classifications/CreateClassificationPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":classificationId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Classifications/ViewClassificationPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Classifications/UpdateClassificationPage").then(
                                  convert,
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
                            import("../pages/Departments/IndexDepartmentPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Departments/CreateDepartmentPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":departmentId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Departments/ViewDepartmentPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Departments/UpdateDepartmentPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "advanced-tools",
                              lazy: () =>
                                import("../pages/Departments/AdvancedToolsDepartmentPage").then(
                                  convert,
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
                          lazy: () =>
                            import("../pages/Skills/IndexSkillPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Skills/CreateSkillPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":skillId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Skills/ViewSkillPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Skills/UpdateSkillPage").then(
                                  convert,
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
                          lazy: () =>
                            import("../pages/SkillFamilies/IndexSkillFamilyPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/SkillFamilies/CreateSkillFamilyPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":skillFamilyId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/SkillFamilies/ViewSkillFamilyPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/SkillFamilies/UpdateSkillFamilyPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "announcements",
                      lazy: () =>
                        import("../pages/AnnouncementsPage/AnnouncementsPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "work-streams",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/WorkStreams/IndexWorkStreamPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/WorkStreams/CreateWorkStreamPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":workStreamId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/WorkStreams/ViewWorkStreamsPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/WorkStreams/UpdateWorkStreamPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "job-templates",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/JobPosterTemplateAdminPages/IndexJobPosterTemplatePage/IndexJobPosterTemplatePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/JobPosterTemplateAdminPages/CreateJobPosterTemplatePage/CreateJobPosterTemplatePage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":jobPosterTemplateId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/JobPosterTemplateAdminPages/UpdateJobPosterTemplatePage/UpdateJobPosterTemplatePage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "community-talent",
                  lazy: () =>
                    import("../pages/CommunityInterests/CommunityTalentPage/CommunityTalentPage").then(
                      convert,
                    ),
                },
                {
                  path: "wfa-employees",
                  lazy: () =>
                    import("../pages/WorkforceAdjustment/IndexWorkforceAdjustmentPage/IndexWorkforceAdjustmentPage").then(
                      convert,
                    ),
                },
                {
                  path: "*",
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
              ],
            },
            {
              path: "*",
              loader: () => {
                throw new NotFoundError();
              },
            },
          ],
        },
        {
          path: "*",
          loader: () => {
            throw new NotFoundError();
          },
        },
      ],
    },

    {
      path: `${locale}/indigenous-it-apprentice`,
      lazy: () => import("./Layout/IAPLayout").then(convert),
      children: [
        {
          index: true,
          lazy: () => import("../pages/Home/IAPHomePage/Home").then(convert),
        },
        {
          path: "hire",
          lazy: () =>
            import("../pages/Home/IAPManagerHomePage/IAPManagerHomePage").then(
              convert,
            ),
        },
        {
          path: "*",
          loader: () => {
            throw new NotFoundError();
          },
        },
      ],
    },
  ]);

const Router = () => {
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const featureFlags = useFeatureFlags();
  const router = createRoute(locale, featureFlags);

  return <RouterProvider router={router} />;
};

export default Router;
