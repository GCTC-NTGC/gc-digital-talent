import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./Home/Home";
import Layout from "./Layout";
import LanguageProvider from "./LanguageProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/:locale" element={<LanguageProvider />}>
      <Route path="indigenous-it-apprentice" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Route>,
  ),
);

export const Router: React.FC = () => <RouterProvider router={router} />;

export default Router;
