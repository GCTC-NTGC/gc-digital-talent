import React from "react";
import type { StoryFn } from "@storybook/react";

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
};

const themes: Array<string> = ["light", "dark"];

const Template: StoryFn<typeof Tabs.Root> = (args) => (
  <div>
    {themes.map((theme) => (
      <div key={theme} data-h2={theme}>
        <div
          data-h2-background="base(background)"
          data-h2-padding="base(x1 0)"
          data-h2-max-width="base(100%)"
        >
          <Tabs.Root {...args}>
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
        </div>
      </div>
    ))}
  </div>
);

export const Default = Template.bind({});
Default.args = {
  defaultValue: "one",
};

export const SecondTabOpen = Template.bind({});
SecondTabOpen.args = {
  defaultValue: "two",
};
