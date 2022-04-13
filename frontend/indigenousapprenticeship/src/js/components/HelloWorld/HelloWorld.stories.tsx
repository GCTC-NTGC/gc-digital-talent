import React from "react";
import type { Meta, Story } from "@storybook/react";
import  HelloWorld  from "./HelloWorld";

export default {
  component: HelloWorld,
  title: "Indigenous Apprenticeship/Hello World",
} as Meta;

const TemplateHelloWorld: Story = () => (
  <HelloWorld />
);

export const HelloWorldStory = TemplateHelloWorld.bind({});
