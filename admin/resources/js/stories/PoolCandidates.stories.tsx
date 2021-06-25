import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import PoolCandidatesTable from "../components/PoolCandidatesTable";
import fakePoolCandidates from "../fakeData/fakePoolCandidates";
import {
  useGetPoolCandidatesQuery,
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
} from "../api/generated";
import ClientProvider from "../components/ClientProvider";
import { CreatePoolCandidateForm } from "../components/poolCandidate/CreatePoolCandidate";
import fakeUsers from "../fakeData/fakeUsers";
import fakeClassifications from "../fakeData/fakeClassifications";
import fakePools from "../fakeData/fakePools";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import { UpdatePoolCandidateForm } from "../components/poolCandidate/UpdatePoolCandidate";

const poolCandidateData = fakePoolCandidates();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Pool Candidates", module);

stories.add("Pool Candidates Table", () => (
  <PoolCandidatesTable poolCandidates={poolCandidateData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});
const ApiClassificationTable = () => {
  const [result, _reexecuteQuery] = useGetPoolCandidatesQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <PoolCandidatesTable poolCandidates={data?.poolCandidates ?? []} />;
};
stories.add("Pool Candidates Table with API data", () => (
  <ClientProvider client={client}>
    <ApiClassificationTable />
  </ClientProvider>
));

stories.add("Create Pool Candidate Form", () => (
  <CreatePoolCandidateForm
    users={fakeUsers() as User[]}
    classifications={fakeClassifications() as Classification[]}
    locale="en"
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
    acceptedOperationalRequirements: [],
    cmoAssets: [],
    cmoIdentifier: "cmo1",
    expectedClassifications: [],
    expectedSalary: [],
    expiryDate: "2021-06-27",
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
      locale="en"
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      handleUpdatePoolCandidate={async (id, data: UpdatePoolCandidateInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Pool Candidate")(data);
        return null;
      }}
    />
  );
});
