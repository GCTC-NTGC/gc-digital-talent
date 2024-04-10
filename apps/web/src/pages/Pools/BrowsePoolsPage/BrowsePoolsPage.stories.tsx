import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  CHROMATIC_VIEWPORTS,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { fakePools } from "@gc-digital-talent/fake-data";
import { PoolStatus, PublishingGroup } from "@gc-digital-talent/graphql";

import { BrowsePools } from "./BrowsePoolsPage";

const mockPools = fakePools(3).map((advert) => ({
  ...advert,
  publishingGroup: PublishingGroup.ItJobs,
  status: PoolStatus.Published,
}));

type Meta = Meta<typeof BrowsePools>;
type Story = StoryFn<typeof BrowsePools>;

export default {
  component: BrowsePools,
  title: "Pages/Browse Pools Page",
  decorators: [MockGraphqlDecorator],
} as Meta;

const Template: Story = () => <BrowsePools />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
  apiResponsesConfig: {
    latency: {
      min: 0,
      max: 0,
    },
  },
  apiResponses: {
    BrowsePoolsPage: {
      data: {
        publishedPools: mockPools,
      },
    },
  },
};
