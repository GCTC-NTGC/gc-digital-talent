import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { PoolTable, PoolTableApi } from "../components/PoolTable";
import fakePools from "../fakeData/fakePools";
import ClientProvider from "../components/ClientProvider";

const poolData = fakePools();
// It is possible data may come back from api with missing data.

const stories = storiesOf("Pools", module);

stories.add("Pool Table", () => <PoolTable pools={poolData} editUrlRoot="#" />);

// TODO: Pool Candidates Table API
const client = createClient({
  url: "http://localhost:8000/graphql",
});
stories.add("Pool Table Table with API data", () => (
  <ClientProvider client={client}>
    <PoolTableApi />
  </ClientProvider>
));
