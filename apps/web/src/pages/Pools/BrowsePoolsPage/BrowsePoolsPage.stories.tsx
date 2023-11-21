import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";
import { fakePools } from "@gc-digital-talent/fake-data";

import { PoolStatus, PublishingGroup } from "~/api/generated";

import { BrowsePools } from "./BrowsePoolsPage";

const mockPools = fakePools(3).map((advert) => ({
  ...advert,
  publishingGroup: PublishingGroup.ItJobs,
  status: PoolStatus.Published,
}));

type Meta = ComponentMeta<typeof BrowsePools>;
type Story = ComponentStory<typeof BrowsePools>;

export default {
  component: BrowsePools,
  title: "Pages/Browse Pools Page",
} as Meta;

const Template: Story = () => <BrowsePools pools={mockPools} />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};
