import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Home/Home";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/:locale",
    children: [
      {
        path: "indigenous-it-apprentice",
        element: <Layout />,
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

export const Router = () => <RouterProvider router={router} />;

export default Router;
