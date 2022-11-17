import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "@common/helpers/storybookUtils";
import AccessibilityStatement from "./AccessibilityStatement";

type Meta = ComponentMeta<typeof AccessibilityStatement>;
type Story = ComponentStory<typeof AccessibilityStatement>;

export default {
  component: AccessibilityStatement,
  title: "Accessibility Statement",
} as Meta;

const Template: Story = () => <AccessibilityStatement />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
