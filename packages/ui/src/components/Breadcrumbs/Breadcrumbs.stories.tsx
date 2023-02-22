import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs",
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args} />
);

export const Default = Template.bind({});
Default.args = {
  crumbs: [
    {
      label: "Home",
      url: "#home",
    },
    {
      label: "One",
      url: "#one",
    },
    {
      label: "Two",
      url: "#two",
    },
    {
      label: "Three",
      url: "#three",
    },
  ],
};
