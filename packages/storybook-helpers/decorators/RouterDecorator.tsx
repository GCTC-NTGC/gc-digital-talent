import { JSX } from "react";
import { StoryContext, StoryFn } from "@storybook/react-vite";
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

const RouterDecorator = (Story: StoryFn, { parameters }: StoryContext) => {
  const { defaultPath }: { defaultPath?: DefaultPath } = parameters;
  const router = createRouter(<Story />, defaultPath);
  return <RouterProvider router={router} />;
};

export default RouterDecorator;
