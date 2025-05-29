import { StoryFn, Meta } from "@storybook/react";

import HeaderComponent from "./Header";

export default {
  component: HeaderComponent,
} as Meta;

const TemplateHeader: StoryFn = () => {
  return <HeaderComponent />;
};

export const Header = {
  render: TemplateHeader,
};
