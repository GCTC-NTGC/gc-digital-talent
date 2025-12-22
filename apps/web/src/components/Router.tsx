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
                  path: "settings",
                  children: [
                    {
                      index: true,
                      loader: () => {
                        throw new NotFoundError();
                      },
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
