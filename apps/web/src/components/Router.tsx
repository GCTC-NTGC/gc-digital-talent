import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales } from "@common/helpers/localize";
import Loading from "@common/components/Pending/Loading";
import useLocale from "@common/hooks/useLocale";
import lazyRetry from "@common/helpers/lazyRetry";

import Layout from "~/components/Layout";

/** IAP Home Page */
const IAPHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "iapHomePage" */ "../pages/IAPHomePage/Home"),
  ),
);

const createRoute = (locale: Locales) =>
  createBrowserRouter([
    {
      path: `/${locale}`,
      element: <Layout />,
      children: [
        {
          path: "indigenous-it-apprentice",
          children: [
            {
              index: true,
              element: <IAPHomePage />,
            },
          ],
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
