import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";
import Home from "./HomePage";

type Meta = ComponentMeta<typeof Home>;
type Story = ComponentStory<typeof Home>;

export default {
  component: Home,
  title: "Pages/Home Page/Digital Talent",
} as Meta;

const Template: Story = () => (
  <div data-h2-color="base(black) base:dark(white)">
    <Home defaultImage={0} />
  </div>
);

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
