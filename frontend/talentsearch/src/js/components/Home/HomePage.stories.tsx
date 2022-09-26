import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Home from "./HomePage";

type Meta = ComponentMeta<typeof Home>;
type Story = ComponentStory<typeof Home>;

export default {
  component: Home,
  title: "Home Page",
} as Meta;

const Template: Story = () => <Home />;

export const StaticHomePage = Template.bind({});
