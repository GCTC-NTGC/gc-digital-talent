import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeUsers,
  fakePools,
} from "@common/fakeData";
import { OperationalRequirementV2 } from "@common/constants/localizedConstants";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  Pool,
  PoolStatus,
  UpdatePoolInput,
  User,
  UserPublicProfile,
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
    users={fakeUsers() as User[]}
    handleCreatePool={async (data: CreatePoolInput) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Pool")(data);
      return null;
    }}
  />
));

stories.add("Update Pool Form", () => {
  const pool: Pool = {
    id: "1",
    owner: fakeUsers()[0] as UserPublicProfile,
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
      OperationalRequirementV2[0],
      OperationalRequirementV2[1],
    ],
    keyTasks: {
      en: "Pool Key Tasks",
      fr: "Pool Key Tasks FR",
    },
    status: PoolStatus.NotTakingApplications,
  };

  return (
    <UpdatePoolForm
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      initialPool={pool}
      users={fakeUsers() as User[]}
      handleUpdatePool={async (id: string, data: UpdatePoolInput) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Create Pool")(data);
        return null;
      }}
    />
  );
});
