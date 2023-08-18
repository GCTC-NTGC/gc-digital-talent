import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SupportPage } from "./SupportPage";

export default {
  component: SupportPage,
  title: "Pages/Support Page",
} as ComponentMeta<typeof SupportPage>;

const Template: ComponentStory<typeof SupportPage> = () => {
  return <SupportPage />;
};

export const Default = Template.bind({});
