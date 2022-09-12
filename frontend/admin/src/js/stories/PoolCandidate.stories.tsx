import React from "react";
import { storiesOf } from "@storybook/react";
import { fakePoolCandidates } from "@common/fakeData";
import PoolCandidatesTable from "../components/poolCandidate/PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const stories = storiesOf("Pool Candidates", module);

stories.add("Pool Candidates Table", () => (
  <PoolCandidatesTable poolCandidates={poolCandidateData} editUrlRoot="#" />
));
