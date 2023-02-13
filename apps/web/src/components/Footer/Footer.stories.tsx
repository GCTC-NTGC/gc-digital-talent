import React from "react";
import { Story, Meta } from "@storybook/react";
import FooterComponent from "./Footer";

export default {
  component: FooterComponent,
  title: "Components/Footer",
} as Meta;

const TemplateFooter: Story = () => {
  return <FooterComponent />;
};

export const Footer = TemplateFooter.bind({});
