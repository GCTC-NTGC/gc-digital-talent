import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "@common/helpers/storybookUtils";
import Home from "./HomePage";

type Meta = ComponentMeta<typeof Home>;
type Story = ComponentStory<typeof Home>;

export default {
  component: Home,
  title: "Home Page",
} as Meta;

const Template: Story = () => <Home />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
