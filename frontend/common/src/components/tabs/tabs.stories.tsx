import React from "react";
import { Story, Meta } from "@storybook/react";
import {
  FilterIcon,
  SearchCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import { TabSet, Tab, TabSetProps } from ".";

export default {
  component: TabSet,
  title: "Components/Tabs",
} as Meta;

const TemplateSimple: Story<TabSetProps> = (args) => {
  return (
    <TabSet {...args}>
      <Tab text="Tab 1">Contents of Tab 1</Tab>
      <Tab text="Tab 2">Contents of Tab 2</Tab>
      <Tab text="Tab 3">Contents of Tab 3</Tab>
    </TabSet>
  );
};

const TemplateSkillsToExperience: Story<TabSetProps> = (args) => {
  return (
    <TabSet {...args}>
      <Tab
        icon={<SearchCircleIcon style={{ width: "1rem" }} />}
        text="My frequent skills"
      >
        I&apos;m the frequent skills page!
      </Tab>
      <Tab
        icon={<FilterIcon style={{ width: "1rem" }} />}
        text="Skills in demand"
      >
        I&apos;m the skill in demand page!
      </Tab>
      <Tab
        icon={<SearchCircleIcon style={{ width: "1rem" }} />}
        text="Search by keyword"
      >
        I&apos;m the search by keyword page!
      </Tab>
      <Tab
        tabType="closer"
        iconOpen={<ChevronUpIcon style={{ width: "1.25rem" }} />}
        iconClosed={<ChevronDownIcon style={{ width: "1.25rem" }} />}
        iconPosition="right"
        text="Close"
        placement="end"
      />
    </TabSet>
  );
};

const TemplateSortExperience: Story<TabSetProps> = (args) => {
  return (
    <TabSet {...args}>
      <Tab tabType="label" text="See Experience:" />
      <Tab text="By Date">I&apos;m the By Date page!</Tab>
      <Tab text="By Type">I&apos;m the By Type page!</Tab>
      <Tab text="By Skills">I&apos;m the By Skills page!</Tab>
    </TabSet>
  );
};

export const Simple = TemplateSimple.bind({});
export const SkillsToExperience = TemplateSkillsToExperience.bind({});
export const SortExperience = TemplateSortExperience.bind({});
