import React from "react";
import { Story, Meta } from "@storybook/react";
import { FilterIcon } from "@heroicons/react/solid";
import Breadcrumbs from "./Breadcrumbs";
import type { BreadcrumbProps } from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
  args: {
    links: [],
  },
} as Meta;

const BlackTemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return (
    <div data-h2-font-color="b(black)">
      <Breadcrumbs {...args} />
    </div>
  );
};

const WhiteTemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return (
    <div data-h2-font-color="b(white)" data-h2-bg-color="b(black)">
      <Breadcrumbs {...args} />
    </div>
  );
};

export const BlackFontBreadcrumbs = BlackTemplateBreadcrumbs.bind({});
export const WhiteFontBreadcrumbs = WhiteTemplateBreadcrumbs.bind({});

BlackFontBreadcrumbs.args = {
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

WhiteFontBreadcrumbs.args = {
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
