import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { fakePools } from "@common/fakeData";
import {
  CreatePoolAdvertisementInput,
  GenericJobTitleKey,
} from "../api/generated";

import { CreatePoolForm } from "../components/pool/CreatePool";
import { PoolTable } from "../components/pool/PoolTable";

const poolData = fakePools();
// It is possible data may come back from api with missing data.

const stories = storiesOf("Pools", module);
const storyGenericJobTitles = [
  {
    key: GenericJobTitleKey.TechnicianIt01,
    id: "TechnicianIt01",
    classificationId: "TechnicianIt01",
  },
  {
    key: GenericJobTitleKey.AnalystIt02,
    id: "AnalystIt02",
    classificationId: "AnalystIt02",
  },
  {
    key: GenericJobTitleKey.TechnicalAdvisorIt03,
    id: "TechnicalAdvisorIt03",
    classificationId: "TechnicalAdvisorIt03",
  },
  {
    key: GenericJobTitleKey.TeamLeaderIt03,
    id: "TeamLeaderIt03",
    classificationId: "TeamLeaderIt03",
  },
  {
    key: GenericJobTitleKey.SeniorAdvisorIt04,
    id: "SeniorAdvisorIt04",
    classificationId: "SeniorAdvisorIt04",
  },
  {
    key: GenericJobTitleKey.ManagerIt04,
    id: "ManagerIt04",
    classificationId: "ManagerIt04",
  },
];

stories.add("Pool Table", () => <PoolTable pools={poolData} editUrlRoot="#" />);

stories.add("Create Pool Form", () => (
  <CreatePoolForm
    genericJobTitles={storyGenericJobTitles}
    userId=""
    handleCreatePool={async (
      userId: string,
      data: CreatePoolAdvertisementInput,
    ) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Pool")(data);
      return null;
    }}
  />
));
