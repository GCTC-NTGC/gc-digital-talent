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

const TemplateTabSet: Story<TabSetProps> = (args) => {
  const { ...rest } = args;

  return (
    <TabSet color="primary" mode="inline">
      <Tab behavior="label" text="Select a tab" />
      <Tab
        icon={<SearchCircleIcon style={{ width: "1rem" }} />}
        text="Frequent Skills"
      >
        I'm the frequent skills page!
      </Tab>
      <Tab
        icon={<FilterIcon style={{ width: "1rem" }} />}
        text="Skills in demand"
      >
        I'm the skill in demand page!
      </Tab>
      <Tab
        behavior="close"
        iconOpen={<ChevronUpIcon style={{ width: "1.25rem" }} />}
        iconClosed={<ChevronDownIcon style={{ width: "1.25rem" }} />}
        iconPosition="right"
        text="Close"
        layout="end"
      />
    </TabSet>
  );
};

export const TabSet1 = TemplateTabSet.bind({});
