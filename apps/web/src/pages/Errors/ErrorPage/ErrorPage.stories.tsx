import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";
import Error404 from "./ErrorPage";

type Meta = ComponentMeta<typeof Error404>;
type Story = ComponentStory<typeof Error404>;

export default {
  component: Error404,
  title: "Pages/404 Page",
} as Meta;

const Template: Story = () => <Error404 />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};
