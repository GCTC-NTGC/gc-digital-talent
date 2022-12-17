import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales } from "@common/helpers/localize";
import Loading from "@common/components/Pending/Loading";

import useLocale from "@common/hooks/useLocale";
import Home from "./Home/Home";
import Layout from "./Layout";

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
              element: <Home />,
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
