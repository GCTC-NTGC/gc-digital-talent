import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import { currentDate } from "gc-digital-talent-common";
import PoolCandidatesTable, {
  PoolCandidatesTableApi,
} from "../components/poolCandidate/PoolCandidatesTable";
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
  LanguageAbility,
  WorkRegion,
  PoolCandidateStatus,
  SalaryRange,
  UpdatePoolCandidateMutation,
} from "../api/generated";
import {
  CreatePoolCandidate,
  CreatePoolCandidateForm,
} from "../components/poolCandidate/CreatePoolCandidate";
import fakeUsers from "../fakeData/fakeUsers";
import fakeClassifications from "../fakeData/fakeClassifications";
import fakePools from "../fakeData/fakePools";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import {
  UpdatePoolCandidate,
  UpdatePoolCandidateForm,
} from "../components/poolCandidate/UpdatePoolCandidate";
import ClientProvider from "../components/ClientProvider";

const poolCandidateData = fakePoolCandidates();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Pool Candidates", module);

stories.add("Pool Candidates Table", () => (
  <PoolCandidatesTable poolCandidates={poolCandidateData} editUrlRoot="#" />
));

// TODO: Pool Candidates Table API
const client = createClient({
  url: "http://localhost:8000/graphql",
});
stories.add("Pool Candidates Table with API data", () => (
  <ClientProvider client={client}>
    <PoolCandidatesTableApi poolId="1" />
  </ClientProvider>
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
    expiryDate: currentDate(),
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

stories.add("Create Pool Candidate Form with API", () => {
  return (
    <ClientProvider client={client}>
      <CreatePoolCandidate poolId="1" />
    </ClientProvider>
  );
});

stories.add("Update Pool Candidate Form with API", () => {
  return (
    <ClientProvider client={client}>
      <UpdatePoolCandidate poolCandidateId="1" />
    </ClientProvider>
  );
});
