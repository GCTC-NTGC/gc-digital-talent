import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import PoolCandidatesTable from "../components/poolCandidate/PoolCandidatesTable";
import fakePoolCandidates from "../fakeData/fakePoolCandidates";
import {
  CreatePoolCandidateInput,
  User,
  Classification,
  OperationalRequirement,
  Pool,
  CmoAsset,
  UpdatePoolCandidateInput,
  PoolCandidate,
  UpdatePoolCandidateMutation,
} from "../api/generated";
import { CreatePoolCandidateForm } from "../components/poolCandidate/CreatePoolCandidate";
import fakeUsers from "../fakeData/fakeUsers";
import fakeClassifications from "../fakeData/fakeClassifications";
import fakePools from "../fakeData/fakePools";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import { UpdatePoolCandidateForm } from "../components/poolCandidate/UpdatePoolCandidate";

const poolCandidateData = fakePoolCandidates();

const stories = storiesOf("Pool Candidates", module);

stories.add("Pool Candidates Table", () => (
  <PoolCandidatesTable poolCandidates={poolCandidateData} editUrlRoot="#" />
));

stories.add("Create Pool Candidate Form", () => (
  <CreatePoolCandidateForm
    users={fakeUsers() as User[]}
    classifications={fakeClassifications() as Classification[]}
    operationalRequirements={
      fakeOperationalRequirements() as OperationalRequirement[]
    }
    pools={fakePools() as Pool[]}
    cmoAssets={fakeCmoAssets() as CmoAsset[]}
    handleCreatePoolCandidate={async (data: CreatePoolCandidateInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Pool Candidate")(data);
      return null;
    }}
  />
));

stories.add("Update Pool Candidate Form", () => {
  const poolCandidate: PoolCandidate = poolCandidateData[0];
  return (
    <UpdatePoolCandidateForm
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      initialPoolCandidate={poolCandidate}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      handleUpdatePoolCandidate={async (
        id: string,
        data: UpdatePoolCandidateInput,
      ): Promise<UpdatePoolCandidateMutation["updatePoolCandidate"]> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Pool Candidate")(id, data);
        return Promise.resolve(
          data as UpdatePoolCandidateMutation["updatePoolCandidate"],
        );
      }}
    />
  );
});
