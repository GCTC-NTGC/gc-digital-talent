import { Meta, StoryFn } from "@storybook/react";
import { action } from "storybook/actions";

import {
  fakeApplicantFilters,
  fakeClassifications,
  fakeDepartments,
  fakeLocalizedEnum,
  fakePools,
  fakeSkills,
  fakeWorkStreams,
} from "@gc-digital-talent/fake-data";
import {
  CreatePoolCandidateSearchRequestInput,
  LanguageAbility,
  makeFragmentData,
  PoolCandidateSearchRequestReason,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  MockGraphqlDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";
import { OperationalRequirements } from "@gc-digital-talent/i18n";

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
  decorators: [MockGraphqlDecorator],
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
    apiResponses: {
      PoolsInFilter: {
        data: {
          poolsPaginated: {
            data: [pools[0]],
          },
        },
      },
      RequestOptions: {
        data: {
          requestReasons: fakeLocalizedEnum(PoolCandidateSearchRequestReason),
          languageAbilities: fakeLocalizedEnum(LanguageAbility),
          workRegions: fakeLocalizedEnum(WorkRegion),
          operationalRequirements: fakeLocalizedEnum(OperationalRequirements),
          workStreams: fakeWorkStreams(),
        },
      },
    },
  },
} as Meta;

const Template: StoryFn<RequestFormProps> = (args) => {
  return <RequestForm {...args} />;
};

export const Default = Template.bind({});
