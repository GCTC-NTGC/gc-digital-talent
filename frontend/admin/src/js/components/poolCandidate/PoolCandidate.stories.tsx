import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeUsers,
  fakePools,
  fakePoolCandidates,
} from "@common/fakeData";
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

stories.add(
  "Pool Candidates Table",
  () => <PoolCandidatesTable poolId="123" />,
  {
    apiResponses: {
      GetPoolCandidatesPaginated: {
        data: {
          poolCandidatesPaginated: {
            data: poolCandidateData,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
);

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
    cmoIdentifier: "cmo1",
    expiryDate: "2999-12-31",
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
