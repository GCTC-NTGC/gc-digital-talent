import { JSX } from "react";
import type { Decorator } from "@storybook/react-vite";
import { createMemoryRouter, RouterProvider } from "react-router";

interface DefaultPath {
  path: string;
  initialEntries: string[];
}

const createRouter = (story: JSX.Element, defaultPath?: DefaultPath) =>
  createMemoryRouter(
    [
      {
        /**
         * Use any route and just pass it the current story
         */
        path: defaultPath ? defaultPath.path : "/*",
        element: story,
      },
    ],
    defaultPath
      ? {
          initialEntries: defaultPath.initialEntries,
          initialIndex: 0,
        }
      : undefined,
  );

const RouterDecorator: Decorator = (Story, context) => {
  const { defaultPath }: { defaultPath?: DefaultPath } = context.parameters;
  const router = createRouter(<Story />, defaultPath);
  return <RouterProvider router={router} />;
};

export default RouterDecorator;
