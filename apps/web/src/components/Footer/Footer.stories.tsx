import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import FooterComponent from "./Footer";

export default {
  component: FooterComponent,
  title: "Components/Footer",
} as Meta;

const TemplateFooter: StoryFn = () => {
  return <FooterComponent />;
};

export const Footer = TemplateFooter.bind({});
