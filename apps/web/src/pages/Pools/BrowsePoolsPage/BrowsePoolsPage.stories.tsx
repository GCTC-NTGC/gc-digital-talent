import { Meta, StoryFn } from "@storybook/react";

import {
  CHROMATIC_VIEWPORTS,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { fakePools, toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { PoolStatus, PublishingGroup } from "@gc-digital-talent/graphql";

import BrowsePools from "./BrowsePoolsPage";

const mockPools = fakePools(3).map((advert) => ({
  ...advert,
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Published),
}));

export default {
  component: BrowsePools,
  decorators: [MockGraphqlDecorator],
} as Meta;

const Template: StoryFn<typeof BrowsePools> = () => <BrowsePools />;

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
