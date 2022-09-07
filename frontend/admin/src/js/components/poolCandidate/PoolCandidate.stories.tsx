import React from "react";
import { storiesOf, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeUsers,
  fakePools,
  fakePoolCandidates,
} from "@common/fakeData";
import { OperationalRequirementV1 } from "@common/constants/localizedConstants";
import PoolCandidatesTable from "./PoolCandidatesTable";
import {
  CreatePoolCandidateAsAdminInput,
  User,
  Classification,
  Pool,
  CmoAsset,
  UpdatePoolCandidateAsAdminInput,
  PoolCandidate,
  UpdatePoolCandidateMutation,
  PoolCandidateStatus,
  WorkRegion,
  LanguageAbility,
  SalaryRange,
} from "../../api/generated";
import { CreatePoolCandidateForm } from "./CreatePoolCandidate";
import { UpdatePoolCandidateForm } from "./UpdatePoolCandidate";

const poolCandidateData = fakePoolCandidates();

const mockPaginatorInfo = {
  count: 1,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: true,
  lastItem: 1,
  lastPage: 1,
  perPage: 5,
  total: 100,
};

const stories = storiesOf("Pool Candidates", module);

const PoolCandidatesTableTemplate: Story = () => {
  return <PoolCandidatesTable poolId="123" />;
};

const PoolCandidatesTableStory = PoolCandidatesTableTemplate.bind({});
PoolCandidatesTableStory.parameters = {
  apiResponses: {
    GetPoolCandidatesPaginated: {
      data: {
        poolCandidatesPaginated: {
          data: [...poolCandidateData.slice(0, 4)],
          paginatorInfo: mockPaginatorInfo,
        },
      },
    },
  },
};

stories.add("Pool Candidates Table", PoolCandidatesTableStory);

stories.add("Create Pool Candidate Form", () => (
  <CreatePoolCandidateForm
    users={fakeUsers() as User[]}
    classifications={fakeClassifications() as Classification[]}
    pools={fakePools() as Pool[]}
    cmoAssets={fakeCmoAssets() as CmoAsset[]}
    handleCreatePoolCandidate={async (
      data: CreatePoolCandidateAsAdminInput,
    ) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Pool Candidate")(data);
      return null;
    }}
  />
));

stories.add("Update Pool Candidate Form", () => {
  const poolCandidate: PoolCandidate = {
    id: "1",
    acceptedOperationalRequirements: [
      OperationalRequirementV1[0],
      OperationalRequirementV1[1],
    ],
    cmoAssets: [fakeCmoAssets()[0], fakeCmoAssets()[1]],
    cmoIdentifier: "cmo1",
    expectedClassifications: [
      fakeClassifications()[0],
      fakeClassifications()[1],
    ],
    expectedSalary: [SalaryRange["100KPlus"], SalaryRange["80_89K"]],
    expiryDate: "2999-12-31",
    hasDiploma: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    isWoman: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [WorkRegion.BritishColumbia, WorkRegion.Ontario],
    pool: { id: "pool-id" },
    user: { id: "user-id" },
    status: PoolCandidateStatus.NewApplication,
  };

  return (
    <UpdatePoolCandidateForm
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      initialPoolCandidate={poolCandidate}
      handleUpdatePoolCandidate={async (
        id: string,
        data: UpdatePoolCandidateAsAdminInput,
      ): Promise<UpdatePoolCandidateMutation["updatePoolCandidateAsAdmin"]> => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Update Pool Candidate")(id, data);
        return Promise.resolve(
          data as UpdatePoolCandidateMutation["updatePoolCandidateAsAdmin"],
        );
      }}
    />
  );
});
