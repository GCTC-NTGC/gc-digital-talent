import React from "react";
import { Story, Meta } from "@storybook/react";
import { Footer as FooterComponent } from "./Footer";

export default {
  component: FooterComponent,
  title: "Components/Footer",
} as Meta;

const TemplateFooter: Story = (args) => {
  const { baseUrl } = args;
  return <FooterComponent baseUrl={baseUrl} />;
};

export const Footer = TemplateFooter.bind({});

Footer.args = {
  baseUrl: "/talent",
};
