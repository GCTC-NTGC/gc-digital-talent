import React from "react";
import type { Meta, StoryFn } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon";
import { faker } from "@faker-js/faker/locale/en";
import { action } from "@storybook/addon-actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Accordion from "./Accordion";
import Button from "../Button";

const { Item, Trigger, Content, Root } = Accordion;

const Text = () => {
  faker.seed(0);
  return <p>{faker.lorem.sentences(5)}</p>;
};

export default {
  component: Accordion.Root,
  subcomponents: {
    Root,
    Item,
    Trigger,
    Content,
  },
  args: {
    mode: "simple",
    size: "md",
    type: "multiple",
  },
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["simple", "card"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
    },
  },
} as Meta<typeof Accordion.Root>;

const Template: StoryFn<typeof Accordion.Root> = ({ children, ...rest }) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Trigger icon={AcademicCapIcon} subtitle="Subtitle">
          Accordion One
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger
          icon={Cog8ToothIcon}
          subtitle="Subtitle"
          context="Some additional context"
        >
          Accordion Two
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three">
        <Accordion.Trigger>Accordion Three</Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const ACCORDION_VALUES = ["one", "two", "three"];

type ControlledProps = Omit<
  React.ComponentPropsWithoutRef<typeof Accordion.Root>,
  "type" | "value" | "onValueChange" | "defaultValue"
>;

const ControlledTemplate: StoryFn<ControlledProps> = ({
  children,
  ...rest
}) => {
  const [value, setValue] = React.useState<string[]>([]);
  const someOpen = value.length > 0;

  const toggleAll = () => {
    const newValue = someOpen ? [] : ACCORDION_VALUES;
    action("expand/collapse all")(newValue);
    setValue(newValue);
  };

  return (
    <>
      <Button onClick={toggleAll}>
        {someOpen ? "Collapse" : "Expand"} all
      </Button>
      <Accordion.Root
        type="multiple"
        value={value}
        onValueChange={setValue}
        {...rest}
      >
        <Accordion.Item value="one">
          <Accordion.Trigger>Accordion One</Accordion.Trigger>
          <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="two">
          <Accordion.Trigger>Accordion Two</Accordion.Trigger>
          <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="three">
          <Accordion.Trigger>Accordion Three</Accordion.Trigger>
          <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export const Default = Template.bind({});
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};
Default.args = {
  type: "single",
  collapsible: true,
  children: <Text />,
  size: "md",
};

export const Card = Template.bind({});
Card.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};
Card.args = {
  type: "single",
  mode: "card",
  collapsible: true,
  children: <Text />,
};

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
  defaultValue: "one",
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const Nested = Template.bind({});
Nested.args = {
  type: "single",
  mode: "card",
  collapsible: true,
  children: (
    <>
      <Text />
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="two">
          <Accordion.Trigger>Accordion Two</Accordion.Trigger>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  ),
};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {
  children: <Text />,
};
