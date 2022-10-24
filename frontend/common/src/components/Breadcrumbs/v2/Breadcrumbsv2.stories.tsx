import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs/v2",
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args} />
);

export const Default = Template.bind({});
Default.args = {
  crumbs: [
    {
      label: "Home",
      url: "#",
    },
    {
      label: "One",
      url: "#",
    },
    {
      label: "Two",
      url: "#",
    },
    {
      label: "Three",
      url: "#",
    },
  ],
};
