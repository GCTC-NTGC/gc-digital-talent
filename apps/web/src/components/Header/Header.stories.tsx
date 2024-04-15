import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import HeaderComponent from "./Header";

export default {
  component: HeaderComponent,
  title: "Components/Header",
} as Meta;

const TemplateHeader: StoryFn = () => {
  return <HeaderComponent />;
};

export const Header = TemplateHeader.bind({});
