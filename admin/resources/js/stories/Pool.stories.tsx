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
// It is possible data may come back from api with missing data.

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
  const pool: Pool = {
    id: 1,
    owner: fakeUsers()[0],
    name: {
      en: "Pool Name",
      fr: "Pool Name FR",
    },
    description: {
      en: "Pool Description",
      fr: "Pool Description FR",
    },
    classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    assetCriteria: [fakeCmoAssets()[0], fakeCmoAssets()[1]],
    essentialCriteria: [fakeCmoAssets()[0], fakeCmoAssets()[1]],
    operationalRequirements: [
      fakeOperationalRequirements()[0],
      fakeOperationalRequirements()[1],
    ],
  };

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
