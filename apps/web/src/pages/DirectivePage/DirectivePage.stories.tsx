import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";

import DirectivePage from "./DirectivePage";

type Meta = ComponentMeta<typeof DirectivePage>;
type Story = ComponentStory<typeof DirectivePage>;

export default {
  component: DirectivePage,
  title: "Pages/Directive on Digital Talent",
} as Meta;

const Template: Story = () => <DirectivePage />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  themeKey: "default",
};
