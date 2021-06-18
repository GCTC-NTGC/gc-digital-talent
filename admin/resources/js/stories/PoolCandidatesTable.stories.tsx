import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import PoolCandidatesTable from "../components/PoolCandidatesTable";
import fakePoolCandidates from "../fakeData/fakePoolCandidates";
import { useGetPoolCandidatesQuery } from "../api/generated";
import ClientProvider from "../components/ClientProvider";

const poolCandidateData = fakePoolCandidates();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Pool Candidates", module);

stories.add("Classifications Table", () => (
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
stories.add("Users Table with API data", () => (
  <ClientProvider client={client}>
    <ApiClassificationTable />
  </ClientProvider>
));
