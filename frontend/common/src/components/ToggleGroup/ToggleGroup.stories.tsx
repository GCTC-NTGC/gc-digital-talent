import React from "react";
import { defineMessages, useIntl } from "react-intl";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  AcademicCapIcon,
  BanknotesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import ToggleGroupDocs from "./ToggleGroup.docs.mdx";
import ToggleGroup from ".";

const messages = defineMessages({
  one: {
    defaultMessage: "One",
    id: "R7CBRQ",
    description: "Placeholder text for first toggle group option",
  },
  two: {
    defaultMessage: "Two",
    id: "w6ZMZl",
    description: "Placeholder text for second toggle group option",
  },
  three: {
    defaultMessage: "Three",
    id: "L2BR/I",
    description: "Placeholder text for third toggle group option",
  },
});

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
  parameters: {
    docs: {
      page: ToggleGroupDocs,
    },
  },
} as ComponentMeta<typeof ToggleGroup.Root>;

const AllTemplate: ComponentStory<typeof ToggleGroup.Root> = (args) => {
  const intl = useIntl();
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1, 0)"
      data-h2-align-items="base(center)"
    >
      <ToggleGroup.Root {...args}>
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="secondary">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="cta">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="black">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="white">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="ia-primary">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="ia-secondary">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="yellow">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="blue">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root {...args} color="red">
        <ToggleGroup.Item value="one">
          {intl.formatMessage(messages.one)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">
          {intl.formatMessage(messages.two)}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="three">
          {intl.formatMessage(messages.three)}
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

const Template: ComponentStory<typeof ToggleGroup.Root> = (args) => {
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
  const intl = useIntl();
  return (
    <>
      <ToggleGroup.Item value="one">
        {intl.formatMessage(messages.one)}
      </ToggleGroup.Item>
      <ToggleGroup.Item value="two">
        {intl.formatMessage(messages.two)}
      </ToggleGroup.Item>
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
