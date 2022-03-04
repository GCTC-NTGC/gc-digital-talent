import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  FilterIcon,
  SearchCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import Breadcrumbs, { BreadcrumbsProps } from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
  args: {
    links: [],
    fontColor: "",
  },
} as Meta;

const TemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return <Breadcrumbs {...args} />;
};

export const IndividualBreadcrumbs = TemplateBreadcrumbs.bind({});

IndividualBreadcrumbs.args = {
  links: [
    {
      title: "name",
      href: "localnothost",
      icon: <FilterIcon style={{ width: "0.75rem" }} />,
    },
    { title: "name2", href: "nothost" },
    { title: "no link" },
  ],
  fontColor: "black",
};
