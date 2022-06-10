import React from "react";
import { Story, Meta } from "@storybook/react";
import { fakePools, fakeUsers } from "@common/fakeData";
import { PoolCandidateStatus } from "@common/api/generated";
import { GeneralInformationTab } from "./GeneralInformationTab";

const baseUser = fakeUsers(1)[0];
const basePools = fakePools();

export default {
  component: GeneralInformationTab,
  title: "General information tab",
  args: {
    user: baseUser,
    pools: basePools,
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
        status: PoolCandidateStatus.Available,
        expiryDate: "2022-06-21",
      },
      {
        id: "candidate-2",
        pool: basePools[1],
        status: PoolCandidateStatus.PlacedCasual,
        expiryDate: "2024-03-01",
        notes:
          "Minima sed impedit ea ex voluptatem voluptatum quo. Iure sint quibusdam est expedita quia qui. In et quidem fugiat aut repellat. Odio quae ea esse qui corporis.\n\nSoluta et necessitatibus quod dolores error necessitatibus. Aliquam est quas est corporis. Veniam omnis et molestias aut voluptatum. Repellat vero enim autem placeat expedita.\n\nReprehenderit corrupti molestiae et tempore. Praesentium omnis consequatur facere minus beatae provident numquam. Fugit est labore libero consectetur vitae voluptas accusamus. Voluptatem architecto sunt impedit exercitationem odio corporis cupiditate nobis. Minima quo fugit consectetur qui.",
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
