import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { fakePools, fakeUsers } from "@gc-digital-talent/fake-data";
import { PoolCandidateStatus } from "~/api/generated";

import { GeneralInformationTab } from "./GeneralInformationTab";

const baseUser = fakeUsers(1)[0];
const basePools = fakePools();

export default {
  component: GeneralInformationTab,
  title: "Components/User General Information Tab",
  args: {
    user: baseUser,
    pools: basePools,
  },
  parameters: {
    themeKey: "admin",
  },
} as Meta;

const TemplateInfoTab: Story = (args) => {
  const { user, pools } = args;

  return <GeneralInformationTab user={user} pools={pools} />;
};

export const NotInPools = TemplateInfoTab.bind({});
export const InPools = TemplateInfoTab.bind({});
export const NoEmploymentEquity = TemplateInfoTab.bind({});
export const SomeEmploymentEquity = TemplateInfoTab.bind({});

faker.seed(0);

NotInPools.args = {
  user: {
    ...baseUser,
    poolCandidates: [],
  },
};
InPools.args = {
  user: {
    ...baseUser,
    poolCandidates: [
      {
        id: "candidate-1",
        pool: basePools[0],
        status: PoolCandidateStatus.NewApplication,
        expiryDate: "2022-06-21",
      },
      {
        id: "candidate-2",
        pool: basePools[1],
        status: PoolCandidateStatus.PlacedCasual,
        expiryDate: "2024-03-01",
        notes: faker.lorem.sentences(20),
      },
    ],
  },
};
NoEmploymentEquity.args = {
  user: {
    ...baseUser,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
  },
};
SomeEmploymentEquity.args = {
  user: {
    ...baseUser,
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
  },
};
