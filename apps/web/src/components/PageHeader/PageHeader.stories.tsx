import React from "react";
import { Story, Meta } from "@storybook/react";

import PageHeaderComponent from "./PageHeader";

const HomeIcon: React.FC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

export default {
  component: PageHeaderComponent,
  title: "Components/Page Header",
  args: {
    title: "Page Header",
  },
} as Meta;

const TemplatePageHeader: Story = (args) => {
  const { icon, title } = args;

  return <PageHeaderComponent icon={icon}>{title}</PageHeaderComponent>;
};

export const PageHeader = TemplatePageHeader.bind({});
export const IconPageHeader = TemplatePageHeader.bind({});

PageHeader.args = {
  label: "Basic Page Header",
};

IconPageHeader.args = {
  label: "Icon Page Header",
  icon: HomeIcon,
};
