import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "@common/components/Pending/Loading";

import Home from "./Home/Home";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: ":locale",
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
    ],
  },
]);

export const Router = () => (
  <RouterProvider router={router} fallbackElement={<Loading />} />
);

export default Router;
