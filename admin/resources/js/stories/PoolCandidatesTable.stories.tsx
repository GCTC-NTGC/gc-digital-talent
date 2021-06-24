import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import PoolCandidatesTable from "../components/PoolCandidatesTable";
import fakePoolCandidates from "../fakeData/fakePoolCandidates";
import ClientProvider from "../components/ClientProvider";
import { ClassificationTableApi } from "../components/ClassificationTable";

const poolCandidateData = fakePoolCandidates();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Pool Candidates", module);

stories.add("Classifications Table", () => (
  <PoolCandidatesTable poolCandidates={poolCandidateData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});
stories.add("Classifications Table with API data", () => (
  <ClientProvider client={client}>
    <ClassificationTableApi />
  </ClientProvider>
));
