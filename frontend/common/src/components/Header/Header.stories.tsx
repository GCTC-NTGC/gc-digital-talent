import React from "react";
import { Story, Meta } from "@storybook/react";
import { Header as HeaderComponent } from "./Header";

export default {
  component: HeaderComponent,
  title: "Components/Header",
} as Meta;

const TemplateHeader: Story = (args) => {
  const { baseUrl } = args;
  return <HeaderComponent baseUrl={baseUrl} />;
};

export const Header = TemplateHeader.bind({});

Header.args = {
  baseUrl: "/talent",
};
