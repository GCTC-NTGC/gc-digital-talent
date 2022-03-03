import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Breadcrumbs, { BreadcrumbsProps } from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
  args: {
    links: [],
  },
} as Meta;

const TemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return <Breadcrumbs {...args} />;
};

export const IndividualBreadcrumbs = TemplateBreadcrumbs.bind({});

IndividualBreadcrumbs.args = {
  links: [
    { title: "name", href: "localnothost" },
    { title: "name2", href: "nothost" },
    { title: "no link", href: "errors-sigh" },
  ],
};
