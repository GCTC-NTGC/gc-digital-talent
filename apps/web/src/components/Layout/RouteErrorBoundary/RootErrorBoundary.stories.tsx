import { Meta, StoryObj } from "@storybook/react-vite";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import ErrorBoundary from "./RootErrorBoundary";

export default {
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>;

export const Default: StoryObj<typeof ErrorBoundary> = {
  render: ErrorBoundary,
  parameters: {
    chromatic: { viewports: CHROMATIC_VIEWPORTS },
  },
};
