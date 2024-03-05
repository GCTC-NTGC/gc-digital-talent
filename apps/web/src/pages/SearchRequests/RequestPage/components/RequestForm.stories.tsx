import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeApplicantFilters,
  fakeClassifications,
  fakeDepartments,
  fakePools,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import { CreatePoolCandidateSearchRequestInput } from "@gc-digital-talent/graphql";

import { RequestForm, RequestFormProps } from "./RequestForm";

const classifications = fakeClassifications();
const pools = fakePools();
const skills = fakeSkills();

const applicantFilter = fakeApplicantFilters()[0];
applicantFilter.skills = [skills[0], skills[1]];
applicantFilter.pools = [pools[0]];
applicantFilter.qualifiedClassifications = [classifications[0]];

export default {
  component: RequestForm,
  title: "Forms/Request Form",
  args: {
    departments: fakeDepartments(),
    applicantFilter,
    classifications,
    pools,
    skills,
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
