import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  AcademicCapIcon,
  Cog8ToothIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/solid";
import { faker } from "@faker-js/faker";

import AccordionDocs from "./Accordion.docs.mdx";
import Accordion from "./Accordion";

const { Item, Trigger, Content, Root } = Accordion;

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
} as ComponentMeta<typeof Accordion.Root>;

const Template: ComponentStory<typeof Accordion.Root> = ({
  children,
  ...rest
}) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Trigger Icon={AcademicCapIcon} subtitle="Subtitle">
          Accordion One
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger Icon={Cog8ToothIcon} subtitle="Subtitle">
          Accordion Two
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three">
        <Accordion.Trigger Icon={GlobeAmericasIcon} subtitle="Subtitle">
          Accordion Three
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const Text = () => {
  faker.seed(0);
  return <p>{faker.lorem.sentences(5)}</p>;
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
          <Accordion.Trigger Icon={AcademicCapIcon} subtitle="Subtitle">
            Accordion Two
          </Accordion.Trigger>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  ),
};
