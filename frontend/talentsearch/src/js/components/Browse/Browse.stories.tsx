import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "@common/helpers/storybookUtils";
import Browse from "./Browse";

type Meta = ComponentMeta<typeof Browse>;
type Story = ComponentStory<typeof Browse>;

export default {
  component: Browse,
  title: "Browse Page",
} as Meta;

const Template: Story = () => <Browse />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
};
