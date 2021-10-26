import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeDepartments } from "@common/fakeData";
import { Department } from "@common/api/generated";
import { CreateRequest } from "../components/request/CreateRequest";
import { CreatePoolCandidateSearchRequestInput } from "../api/generated";

const stories = storiesOf("Search Request Form", module);

stories.add("Create Search Request Form", () => {
  return (
    <CreateRequest
      departments={fakeDepartments() as Department[]}
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
