import React from "react";
import { Story, Meta } from "@storybook/react";

import HeaderComponent from "./Header";

export default {
  component: HeaderComponent,
  title: "Components/Header",
  parameters: {
    chromatic: { delay: 300 },
  },
} as Meta;

const TemplateHeader: Story = () => {
  return <HeaderComponent />;
};

export const Header = TemplateHeader.bind({});
