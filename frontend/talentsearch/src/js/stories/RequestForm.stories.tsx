import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeDepartments } from "@common/fakeData";
import {
  RequestForm,
  RequestFormProps,
} from "../components/request/CreateRequest";
import {
  CreatePoolCandidateSearchRequestInput,
  OperationalRequirement,
  PoolCandidateFilter,
  WorkRegion,
} from "../api/generated";

const poolCandidateFilter: PoolCandidateFilter = {
  id: "9ef184ad-1752-411e-a022-7f7989f6bf27",
  classifications: [
    {
      id: "90689420-553d-4a3b-999a-fb94b1baaa69",
      group: "IT",
      level: 4,
    },
    {
      id: "bcfa88b3-ed22-4879-8642-e7dd003e91b4",
      group: "IT",
      level: 5,
    },
    {
      id: "7b0d9293-e811-413c-b0df-346e55f3fdd0",
      group: "EC",
      level: 1,
    },
  ],
  hasDiploma: false,
  equity: {
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    isWoman: false,
  },
  languageAbility: null,
  operationalRequirements: [
    OperationalRequirement.DriversLicense,
    OperationalRequirement.OnCall,
  ],
  workRegions: [WorkRegion.Ontario, WorkRegion.Quebec],
  pools: [
    {
      id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
    },
  ],
};

export default {
  component: RequestForm,
  title: "RequestForm",
  args: {
    departments: fakeDepartments(),
    poolCandidateFilter,
    candidateCount: 10,
    handleCreatePoolCandidateSearchRequest: async (
      data: CreatePoolCandidateSearchRequestInput,
    ) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Pool Candidate Search Request")(data);
      return null;
    },
  },
} as Meta;

const Template: Story<RequestFormProps> = (args) => {
  return <RequestForm {...args} />;
};

export const Default = Template.bind({});
