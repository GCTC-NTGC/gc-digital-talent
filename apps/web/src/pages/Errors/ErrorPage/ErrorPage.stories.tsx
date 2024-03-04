import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import Error404 from "./ErrorPage";

type Meta = ComponentMeta<typeof Error404>;
type Story = ComponentStory<typeof Error404>;

export default {
  component: Error404,
  title: "Pages/404 Page",
} as Meta;

const Template: Story = () => <Error404 />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
