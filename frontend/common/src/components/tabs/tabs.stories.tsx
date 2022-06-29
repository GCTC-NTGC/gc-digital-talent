import React from "react";
import type { Story, Meta } from "@storybook/react";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from ".";

export default {
  component: Tabs,
  title: "Components/Tabs",
} as Meta;

const Template: Story = () => {
  return (
    <Tabs>
      <TabList>
        <Tab index={0}>One</Tab>
        <Tab index={1}>Two</Tab>
        <Tab index={2}>Three</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export const HorizontalTabs = Template.bind({});
