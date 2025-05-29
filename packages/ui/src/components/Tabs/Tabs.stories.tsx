import type { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Tabs from "./Tabs";

export default {
  component: Tabs.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const Template: StoryFn<typeof Tabs.Root> = () => (
  <Tabs.Root defaultValue="one">
    <Tabs.List aria-label="Tabs Nav">
      <Tabs.Trigger value="one">One</Tabs.Trigger>
      <Tabs.Trigger value="two">Two</Tabs.Trigger>
      <Tabs.Trigger value="three">Three</Tabs.Trigger>
      <Tabs.Trigger value="four">Four</Tabs.Trigger>
      <Tabs.Trigger value="five">Five</Tabs.Trigger>
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
    <Tabs.Content value="four">
      <p>Four</p>
    </Tabs.Content>
    <Tabs.Content value="five">
      <p>Five</p>
    </Tabs.Content>
  </Tabs.Root>
);

export const Default = {
  render: Template,
};
