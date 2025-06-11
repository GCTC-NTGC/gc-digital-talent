import { Meta, StoryFn } from "@storybook/react-vite";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import ErrorBoundary from "./RouteErrorBoundary";

export default {
  component: ErrorBoundary,
} as Meta;

const Template: StoryFn<typeof ErrorBoundary> = () => <ErrorBoundary />;

export const Default = {
  render: Template,

  parameters: {
    chromatic: { viewports: CHROMATIC_VIEWPORTS },
  },
};
