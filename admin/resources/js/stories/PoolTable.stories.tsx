import React from "react";
import { storiesOf } from "@storybook/react";
import { PoolTable } from "../components/PoolTable";
import fakePools from "../fakeData/fakePools";

const poolData = fakePools();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Pool Candidates", module);

stories.add("Pool Candidates Table", () => (
  <PoolTable pools={poolData} editUrlRoot="#" />
));
