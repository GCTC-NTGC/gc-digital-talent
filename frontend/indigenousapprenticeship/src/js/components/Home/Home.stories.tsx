import React from "react";
import type { Meta, Story } from "@storybook/react";
import Home from "./Home";

export default {
  component: Home,
  title: "Indigenous Apprenticeship/Home Page",
} as Meta;

const TemplateHome: Story = () => <Home />;

export const HomeStory = TemplateHome.bind({});
