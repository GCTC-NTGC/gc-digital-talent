import { StoryFn, Meta } from "@storybook/react";

import FooterComponent from "./Footer";

export default {
  component: FooterComponent,
} as Meta;

const TemplateFooter: StoryFn = () => {
  return <FooterComponent />;
};

export const Footer = {
  render: TemplateFooter,
};
