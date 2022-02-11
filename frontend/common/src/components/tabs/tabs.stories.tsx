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
  title: "Components/Tabs",
} as Meta;

const TemplateSimple: Story<TabSetProps> = (args) => {
  const { ...rest } = args;
  return (
    <TabSet color="primary" mode="inline">
      <Tab text="Tab 1">Contents of Tab 1</Tab>
      <Tab text="Tab 2">Contents of Tab 2</Tab>
      <Tab text="Tab 3">Contents of Tab 3</Tab>
    </TabSet>
  );
};

const TemplateSkillsToExperience: Story<TabSetProps> = (args) => {
  const { ...rest } = args;
  return (
    <TabSet color="primary" mode="inline">
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
        variant="close"
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
  const { ...rest } = args;
  return (
    <TabSet color="primary" mode="inline">
      <Tab variant="label" text="See Experience:" />
      <Tab text="By Date">
        I&apos;m the <i>By Date</i> page!
      </Tab>
      <Tab text="By Type">
        I&apos;m the <i>By Type</i> page!
      </Tab>
      <Tab text="By Skills">
        I&apos;m the <i>By Skills</i> page!
      </Tab>
    </TabSet>
  );
};

export const Simple = TemplateSimple.bind({});
export const SkillsToExperience = TemplateSkillsToExperience.bind({});
export const SortExperience = TemplateSortExperience.bind({});
