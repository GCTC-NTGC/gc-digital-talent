import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import Error404 from "./ErrorPage";

type Meta = Meta<typeof Error404>;
type Story = StoryFn<typeof Error404>;

export default {
  component: Error404,
  title: "Pages/404 Page",
} as Meta;

const Template: Story = () => <Error404 />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
