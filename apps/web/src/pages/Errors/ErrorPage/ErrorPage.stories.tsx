import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import Error404 from "./ErrorPage";

export default {
  component: Error404,
  title: "Pages/404 Page",
} as Meta;

const Template: StoryFn<typeof Error404> = () => <Error404 />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
