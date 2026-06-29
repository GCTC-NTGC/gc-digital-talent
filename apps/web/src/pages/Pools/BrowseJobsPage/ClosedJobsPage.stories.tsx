import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  CHROMATIC_VIEWPORTS,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { fakePools, toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { PoolStatus, PublishingGroup } from "@gc-digital-talent/graphql";

import ClosedJobs from "./ClosedJobsPage";

const mockPools = fakePools(3).map((advert) => ({
  ...advert,
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Closed),
  publishedAt: "2000-01-01",
  closingDate: "2001-01-01",
  archivedAt: null,
}));

export default {
  component: ClosedJobs,
  decorators: [MockGraphqlDecorator],
} as Meta;

const Template: StoryFn<typeof ClosedJobs> = () => <ClosedJobs />;

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
    ClosedJobsPage: {
      data: {
        poolsPaginated: {
          data: mockPools,
        },
      },
    },
  },
};
