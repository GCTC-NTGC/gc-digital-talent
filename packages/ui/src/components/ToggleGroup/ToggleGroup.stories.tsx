import type { StoryFn, Meta } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/20/solid/AcademicCapIcon";
import BanknotesIcon from "@heroicons/react/20/solid/BanknotesIcon";
import UserIcon from "@heroicons/react/20/solid/UserIcon";

import ToggleGroup from "./ToggleGroup";

export default {
  component: ToggleGroup.Root,
  args: {
    type: "single",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
  },
} as Meta<typeof ToggleGroup.Root>;

const AllTemplate: StoryFn<typeof ToggleGroup.Root> = (args) => {
  return (
    <div data-h2-padding="base(x2)">
      <ToggleGroup.Root {...args}>
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

const Template: StoryFn<typeof ToggleGroup.Root> = (args) => {
  const { children, ...rest } = args;

  return (
    <div data-h2-padding="base(x2)">
      <ToggleGroup.Root {...rest}>{children}</ToggleGroup.Root>
    </div>
  );
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

export const WithPrefix = AllTemplate.bind({});
WithPrefix.args = {
  type: "single",
  label: <span>Prefix</span>,
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
