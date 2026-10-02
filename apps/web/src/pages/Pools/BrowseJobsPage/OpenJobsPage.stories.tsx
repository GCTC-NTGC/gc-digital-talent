import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  CHROMATIC_VIEWPORTS,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { fakePools, toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { PoolStatus } from "@gc-digital-talent/graphql";

import OpenJobs from "./OpenJobsPage";

const mockPools = fakePools(3).map((advert) => ({
  ...advert,
  status: toLocalizedEnum(PoolStatus.Published, "LocalizedPoolStatus"),
}));

export default {
  component: OpenJobs,
  decorators: [MockGraphqlDecorator],
} as Meta;

const Template: StoryFn<typeof OpenJobs> = () => <OpenJobs />;

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
    OpenJobsPage: {
      data: {
        poolsPaginated: {
          data: mockPools,
        },
      },
    },
  },
};
