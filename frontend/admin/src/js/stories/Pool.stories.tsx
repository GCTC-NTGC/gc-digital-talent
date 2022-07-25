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
  User,
} from "../api/generated";
import { CreatePoolForm } from "../components/pool/CreatePool";
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
