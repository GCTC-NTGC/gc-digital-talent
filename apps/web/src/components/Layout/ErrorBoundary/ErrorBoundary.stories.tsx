import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import { ErrorBoundary } from "./ErrorBoundary";

export default {
  component: ErrorBoundary,
} as Meta;

const Template: StoryFn<typeof ErrorBoundary> = () => <ErrorBoundary />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
