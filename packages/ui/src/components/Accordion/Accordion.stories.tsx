import React from "react";
import type { StoryFn } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon";
import { faker } from "@faker-js/faker";

import AccordionDocs from "./Accordion.docs.mdx";
import Accordion from "./Accordion";
import StandardHeader from "./StandardHeader";

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
        <StandardHeader Icon={AcademicCapIcon} subtitle="Subtitle">
          Accordion One
        </StandardHeader>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <StandardHeader Icon={Cog8ToothIcon} subtitle="Subtitle">
          Accordion Two
        </StandardHeader>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three">
        <Accordion.Header headingAs="h3">
          <Accordion.Trigger>Accordion Three</Accordion.Trigger>
        </Accordion.Header>
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

export const Simple = Template.bind({});
Simple.args = {
  type: "single",
  mode: "simple",
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
  collapsible: true,
  children: (
    <>
      <Text />
      <Accordion.Root type="single" collapsible mode="simple">
        <Accordion.Item value="two">
          <Accordion.Header>
            <Accordion.Trigger>Accordion Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  ),
};
