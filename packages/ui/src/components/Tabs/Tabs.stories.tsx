import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import TabsDocs from "./Tabs.docs.mdx";
import Tabs from "./Tabs";

export default {
  component: Tabs.Root,
  title: "Components/Tabs",
  parameters: {
    docs: {
      page: TabsDocs,
    },
  },
} as ComponentMeta<typeof Tabs.Root>;

const Template: ComponentStory<typeof Tabs.Root> = (args) => (
  <Tabs.Root {...args}>
    <Tabs.List aria-label="Tabs Nav">
      <Tabs.Trigger value="one">One</Tabs.Trigger>
      <Tabs.Trigger value="two">Two</Tabs.Trigger>
      <Tabs.Trigger value="three">Three</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="one">
      <p>One</p>
    </Tabs.Content>
    <Tabs.Content value="two">
      <p>Two</p>
    </Tabs.Content>
    <Tabs.Content value="three">
      <p>Three</p>
    </Tabs.Content>
  </Tabs.Root>
);

export const Default = Template.bind({});
Default.args = {
  defaultValue: "one",
};

export const SecondTabOpen = Template.bind({});
SecondTabOpen.args = {
  defaultValue: "two",
};
