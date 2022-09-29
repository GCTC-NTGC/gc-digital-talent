import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import * as ToggleGroup from "./ToggleGroup";

export default {
  component: ToggleGroup.Root,
  name: "Components/ToggleGroup",
  args: {
    type: "single",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
  },
} as ComponentMeta<typeof ToggleGroup.Root>;

const Template: ComponentStory<typeof ToggleGroup.Root> = (args) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(0, x1)"
    data-h2-align-items="base(center)"
  >
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="secondary">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="cta">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="black">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="white">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="ia-primary">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="ia-secondary">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="yellow">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="blue">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root {...args} color="red">
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>
);

export const Single = Template.bind({});
Single.args = {
  type: "single",
};

export const Multiple = Template.bind({});
Multiple.args = {
  type: "multiple",
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  type: "single",
  defaultValue: "two",
};
