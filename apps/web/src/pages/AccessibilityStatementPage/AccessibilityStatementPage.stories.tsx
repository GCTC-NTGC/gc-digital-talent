import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import AccessibilityStatement from "./AccessibilityStatementPage";

export default {
  component: AccessibilityStatement,
} as Meta;

const Template: StoryFn<typeof AccessibilityStatement> = () => (
  <AccessibilityStatement />
);

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
