import type { Meta, StoryFn } from "@storybook/react-vite";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon";
import { faker } from "@faker-js/faker/locale/en";
import { action } from "storybook/actions";
import { ComponentPropsWithoutRef, useState } from "react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Accordion from "./Accordion";
import Button from "../Button";
import { testMetaData } from "./utils";

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
        <Accordion.Trigger subtitle="Subtitle">
          Accordion Three
        </Accordion.Trigger>
        <Accordion.MetaData metadata={testMetaData} />
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="four">
        <Accordion.Trigger>Accordion Four</Accordion.Trigger>
        <Accordion.MetaData metadata={testMetaData} />
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const ACCORDION_VALUES = ["one", "two", "three"];

type ControlledProps = Omit<
  ComponentPropsWithoutRef<typeof Accordion.Root>,
  "type" | "value" | "onValueChange" | "defaultValue"
>;

const ControlledTemplate: StoryFn<ControlledProps> = ({
  children,
  ...rest
}) => {
  const [value, setValue] = useState<string[]>([]);
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

export const Default = {
  render: Template,

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },

  args: {
    type: "single",
    collapsible: true,
    children: <Text />,
  },
};

export const Card = {
  render: Template,

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },

  args: {
    type: "single",
    mode: "card",
    collapsible: true,
    children: <Text />,
  },
};

export const DefaultOpen = {
  render: Template,

  args: {
    defaultValue: "one",
    type: "single",
    collapsible: true,
    children: <Text />,
  },
};

export const Nested = {
  render: Template,

  args: {
    type: "single",
    mode: "card",
    collapsible: true,
    children: (
      <>
        <Text />
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="sub-one">
            <Accordion.Trigger>Accordion Sub One</Accordion.Trigger>
            <Accordion.Content>
              <Text />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="sub-two">
            <Accordion.Trigger>Accordion Sub Two</Accordion.Trigger>
            <Accordion.Content>
              <Text />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </>
    ),
  },
};

export const Controlled = {
  render: ControlledTemplate,

  args: {
    children: <Text />,
  },
};
