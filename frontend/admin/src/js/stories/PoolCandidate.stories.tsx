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
import { OperationalRequirementV1 } from "@common/constants/localizedConstants";
import PoolCandidatesTable from "../components/poolCandidate/PoolCandidatesTable";
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
    pool: null,
    user: null,
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
