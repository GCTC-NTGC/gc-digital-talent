import React from "react";
import type { StoryFn } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon";
import { faker } from "@faker-js/faker";

import AccordionDocs from "./Accordion.docs.mdx";
import Accordion from "./Accordion";

const { Item, Trigger, Content, Root } = Accordion;

const Text = () => {
  faker.seed(0);
  return <p>{faker.lorem.sentences(5)}</p>;
};

export default {
  component: Accordion.Root,
  title: "Components/Accordion",
  subcomponents: {
    Root,
    Item,
    Trigger,
    Content,
  },
  parameters: {
    docs: {
      page: AccordionDocs,
    },
  },
};

const Template: StoryFn<typeof Accordion.Root> = ({ children, ...rest }) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Trigger icon={AcademicCapIcon} subtitle="Subtitle" size="sm">
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
        <Accordion.Trigger size="lg">Accordion Three</Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const Card = Template.bind({});
Card.args = {
  type: "single",
  mode: "card",
  collapsible: true,
  children: <Text />,
};

export const CardSpaced = Template.bind({});
CardSpaced.args = {
  type: "single",
  mode: "card",
  spaced: true,
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
