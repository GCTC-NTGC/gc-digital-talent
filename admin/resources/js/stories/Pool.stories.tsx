import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeUsers,
  fakePools,
  fakeOperationalRequirements,
} from "@common/fakeData";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  OperationalRequirement,
  Pool,
  UpdatePoolInput,
  User,
} from "../api/generated";
import { CreatePoolForm } from "../components/pool/CreatePool";
import { UpdatePoolForm } from "../components/pool/UpdatePool";
import { PoolTable } from "../components/pool/PoolTable";

const poolData = fakePools();
// It is possible data may come back from api with missing data.

const stories = storiesOf("Pools", module);

stories.add("Pool Table", () => <PoolTable pools={poolData} editUrlRoot="#" />);

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
    id: "1",
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
