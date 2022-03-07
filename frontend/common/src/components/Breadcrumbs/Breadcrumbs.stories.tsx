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
  },
} as Meta;

const TemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return <Breadcrumbs {...args} />;
};

export const IndividualBreadcrumbs = TemplateBreadcrumbs.bind({});

IndividualBreadcrumbs.args = {
  links: [
    {
      title: "My Name",
      href: "localnothost",
      icon: <FilterIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    { title: "Not My Name", href: "nothost" },
    { title: "No Link" },
  ],
};
