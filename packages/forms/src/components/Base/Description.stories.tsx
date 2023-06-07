import React from "react";
import { StoryFn } from "@storybook/react";

import Description from "./Description";

export default {
  title: "Forms/Base/Description",
  component: Description,
};

const Template: StoryFn<typeof Description> = (args) => (
  <Description {...args} />
);

export const Default = Template.bind({});
