import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeApplicantFilters,
  fakeClassifications,
  fakeDepartments,
  fakePools,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import {
  CreatePoolCandidateSearchRequestInput,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import {
  RequestForm,
  RequestFormClassification_Fragment,
  RequestFormDepartment_Fragment,
  RequestFormProps,
} from "./RequestForm";

const classifications = fakeClassifications();
const pools = fakePools();
const skills = fakeSkills();
const departments = fakeDepartments();
const applicantFilters = fakeApplicantFilters();

const departmentFragments = departments.map((department) =>
  makeFragmentData(department, RequestFormDepartment_Fragment),
);

const classificationFragments = classifications.map((classification) =>
  makeFragmentData(classification, RequestFormClassification_Fragment),
);

const [applicantFilter] = applicantFilters;
applicantFilter.skills = [skills[0], skills[1]];
applicantFilter.pools = [pools[0]];
applicantFilter.qualifiedClassifications = [classifications[0]];

export default {
  component: RequestForm,
  args: {
    departmentsQuery: departmentFragments,
    classificationsQuery: classificationFragments,
    applicantFilter,
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
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
      },
    },
  },
} as Meta;

const Template: StoryFn<RequestFormProps> = (args) => {
  return <RequestForm {...args} />;
};

export const Default = Template.bind({});
