import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeDepartments, fakePoolCandidateFilters } from "@common/fakeData";
import { RequestForm } from "../components/request/CreateRequest";
import {
  CreatePoolCandidateSearchRequestInput,
  PoolCandidateFilter,
} from "../api/generated";

const stories = storiesOf("Search Request Form", module);

stories.add("Search Request Form", () => {
  return (
    <RequestForm
      departments={fakeDepartments()}
      poolCandidateFilter={fakePoolCandidateFilters()[0] as PoolCandidateFilter}
      handleCreatePoolCandidateSearchRequest={async (
        data: CreatePoolCandidateSearchRequestInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Pool Candidate Search Request")(data);
        return null;
      }}
    />
  );
});
