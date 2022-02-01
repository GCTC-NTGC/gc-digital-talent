import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { currentDate } from "@common/helpers/formUtils";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeUsers,
  fakePools,
  fakeOperationalRequirements,
  fakePoolCandidates,
} from "@common/fakeData";
import PoolCandidatesTable from "../components/poolCandidate/PoolCandidatesTable";
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
  PoolCandidateStatus,
  WorkRegion,
  LanguageAbility,
  SalaryRange,
} from "../api/generated";
import { CreatePoolCandidateForm } from "../components/poolCandidate/CreatePoolCandidate";
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
  const poolCandidate: PoolCandidate = {
    id: "1",
    acceptedOperationalRequirements: [
      fakeOperationalRequirements()[0],
      fakeOperationalRequirements()[1],
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
    pool: null,
    user: null,
    status: PoolCandidateStatus.Available,
  };

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
