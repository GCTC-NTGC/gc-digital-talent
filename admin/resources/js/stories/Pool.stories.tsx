import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  OperationalRequirement,
  Pool,
  UpdatePoolInput,
  User,
} from "../api/generated";
import { CreatePoolForm, CreatePool } from "../components/pool/CreatePool";
import fakeClassifications from "../fakeData/fakeClassifications";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import fakeUsers from "../fakeData/fakeUsers";
import { UpdatePool, UpdatePoolForm } from "../components/pool/UpdatePool";
import ClientProvider from "../components/ClientProvider";
import { PoolTable, PoolTableApi } from "../components/pool/PoolTable";
import fakePools from "../fakeData/fakePools";

const poolData = fakePools();

const stories = storiesOf("Pools", module);

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("Pool Table", () => <PoolTable pools={poolData} editUrlRoot="#" />);

stories.add("Pool Table with API data", () => (
  <ClientProvider client={client}>
    <PoolTableApi />
  </ClientProvider>
));

stories.add("Create Pool Form", () => (
  <CreatePoolForm
    classifications={fakeClassifications() as Classification[]}
    cmoAssets={fakeCmoAssets() as CmoAsset[]}
    operationalRequirements={
      fakeOperationalRequirements() as OperationalRequirement[]
    }
    users={fakeUsers() as User[]}
    handleCreatePool={async (data: CreatePoolInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Pool")(data);
      return null;
    }}
  />
));

stories.add("Update Pool Form", () => {
  const pool: Pool = poolData[0];
  return (
    <UpdatePoolForm
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      initialPool={pool}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      users={fakeUsers() as User[]}
      handleUpdatePool={async (id: string, data: UpdatePoolInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Pool")(data);
        return null;
      }}
    />
  );
});

stories.add("Create Pool Form with API", () => {
  return (
    <ClientProvider client={client}>
      <CreatePool />
    </ClientProvider>
  );
});

stories.add("Update Pool Form with API", () => {
  return (
    <ClientProvider client={client}>
      <UpdatePool poolId="1" />
    </ClientProvider>
  );
});
