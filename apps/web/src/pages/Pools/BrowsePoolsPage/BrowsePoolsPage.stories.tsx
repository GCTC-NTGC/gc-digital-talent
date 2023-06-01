import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { widthOf, heightOf } from "storybook-helpers";
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

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};
