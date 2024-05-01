import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { SupportPage } from "./SupportPage";

export default {
  component: SupportPage,
} as Meta<typeof SupportPage>;

const Template: StoryFn<typeof SupportPage> = () => {
  return <SupportPage />;
};

export const Default = Template.bind({});
