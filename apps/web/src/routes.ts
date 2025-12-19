import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("/", "./pages/Root/RootLocaleRedirect.tsx"),

  ...prefix(":locale", [
    layout("./components/Layout/MainLayout.tsx", [
      // NOTE: Required for the nice error boundary
      route("", "./pages/Root/ErrorBoundaryWrapper.tsx", [
        index("./pages/Home/HomePage/HomePage.tsx"),
        route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
          id: "main-not-found",
        }),
      ]),
    ]),

    ...prefix("indigenous-it-apprentice", [
      layout("./components/Layout/IAPLayout.tsx", [
        route(
          "",
          "./pages/Root/ErrorBoundaryWrapper.tsx",
          { id: "iap-boundary" },
          [
            index("./pages/Home/IAPHomePage/Home.tsx"),
            route(
              "hire",
              "./pages/Home/IAPManagerHomePage/IAPManagerHomePage.tsx",
            ),

            route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
              id: "iap-not-found",
            }),
          ],
        ),
      ]),
    ]),
  ]),

  route("*", "./pages/NotFoundPage/NotFoundPage.tsx", { id: "root-not-found" }),
] satisfies RouteConfig;
