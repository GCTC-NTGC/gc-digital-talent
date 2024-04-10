import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import AccessibilityStatement from "./AccessibilityStatementPage";

type Meta = Meta<typeof AccessibilityStatement>;
type Story = StoryFn<typeof AccessibilityStatement>;

export default {
  component: AccessibilityStatement,
  title: "Pages/Accessibility Statement",
} as Meta;

const Template: Story = () => <AccessibilityStatement />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
