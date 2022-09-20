// Vendor dependencies
import React from "react";
import type { Meta, Story } from "@storybook/react";

// Local dependencies
import Home from "./home-2022";

// Default story setup
export default {
  component: Home,
  title: "Static homepage",
} as Meta;

// Export the component as a story
const Template: Story = () => <Home />;

// Export the default story
export const Default = Template.bind({});
