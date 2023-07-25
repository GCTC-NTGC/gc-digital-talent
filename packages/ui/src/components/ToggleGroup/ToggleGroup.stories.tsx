import React from "react";
import type { StoryFn, Meta } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

import ToggleGroupDocs from "./ToggleGroup.docs.mdx";
import ToggleGroup from "./ToggleGroup";

export default {
  component: ToggleGroup.Root,
  title: "Components/ToggleGroup",
  args: {
    type: "single",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
  },
  parameters: {
    docs: {
      page: ToggleGroupDocs,
    },
  },
} as Meta<typeof ToggleGroup.Root>;

const AllTemplate: StoryFn<typeof ToggleGroup.Root> = (args) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1, 0)"
      data-h2-align-items="base(center)"
    >
      <ToggleGroup.Root {...args}>
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="primary.dark">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="secondary">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="tertiary">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="quaternary">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="quinary">
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
    </div>
  );
};

const Template: StoryFn<typeof ToggleGroup.Root> = (args) => {
  const { children, ...rest } = args;

  return <ToggleGroup.Root {...rest}>{children}</ToggleGroup.Root>;
};

export const Single = AllTemplate.bind({});
Single.args = {
  type: "single",
};

export const Multiple = AllTemplate.bind({});
Multiple.args = {
  type: "multiple",
};

export const WithDefaultValue = AllTemplate.bind({});
WithDefaultValue.args = {
  type: "single",
  defaultValue: "two",
};

const TwoOptionsChildren = () => {
  return (
    <>
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
    </>
  );
};

export const WithTwoOptions = Template.bind({});
WithTwoOptions.args = {
  type: "single",
  children: <TwoOptionsChildren />,
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  type: "single",
  children: (
    <>
      <ToggleGroup.Item value="one" aria-label="One">
        <UserIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="two" aria-label="Two">
        <AcademicCapIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="three" aria-label="Three">
        <BanknotesIcon />
      </ToggleGroup.Item>
    </>
  ),
};
