import type { StoryObj, Meta } from "@storybook/react-vite";

import {
  FlexibleWorkLocation,
  LanguageAbility,
  makeFragmentData,
  OperationalRequirement,
  PriorityWeight,
  TalentRequestSource,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  fakeClassifications,
  fakeDepartments,
  fakeSkills,
  fakeUsers,
  fakeWorkStreams,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";

import TalentRequestMatchesTable, {
  TalentRequestMatchesTable_TalentRequestFragment,
} from "./TalentRequestMatchesTable";
import { TalentRequestMatchesApplicantFilter_Fragment } from "./utils";

const mockUsers = fakeUsers(10);

const talentRequestFragment = makeFragmentData(
  {
    id: "talent-request-id",
    applicantFilter: makeFragmentData(
      {
        languageAbility: null,
        locationPreferences: [],
        operationalRequirements: [],
        flexibleWorkLocations: [],
        equity: null,
        qualifiedInClassifications: [],
        qualifiedInWorkStreams: [],
        pools: [],
        skills: [],
      },
      TalentRequestMatchesApplicantFilter_Fragment,
    ),
  },
  TalentRequestMatchesTable_TalentRequestFragment,
);
const rows = mockUsers.map((user) => ({
  __typename: "TalentRequestResult",
  id: user.id,
  user,
  sources: [toLocalizedEnum(TalentRequestSource.QualifiedInPool)],
  skillCount: user.userSkills?.length ?? 0,
}));

const meta = {
  component: TalentRequestMatchesTable,
  args: {
    query: talentRequestFragment,
    skills: [],
  },
  parameters: {
    apiResponses: {
      TalentRequestMatchingUsers: {
        data: {
          talentRequestMatches: {
            data: rows,
            paginatorInfo: {
              total: 10,
            },
          },
        },
      },
      TalentRequestMatchesTable: {
        data: {
          classifications: fakeClassifications(),
          skills: fakeSkills(),
          departments: fakeDepartments(),
          workStreams: fakeWorkStreams(),
          flexibleWorkLocations: Object.values(FlexibleWorkLocation).map(
            (value) => ({
              __typename: "LocalizedFlexibleWorkLocation" as const,
              ...toLocalizedEnum(value),
            }),
          ),
          languageAbilities: Object.values(LanguageAbility).map((value) => ({
            __typename: "LocalizedLanguageAbility" as const,
            ...toLocalizedEnum(value),
          })),
          operationalRequirements: Object.values(OperationalRequirement).map(
            (value) => ({
              __typename: "LocalizedOperationalRequirement" as const,
              ...toLocalizedEnum(value),
            }),
          ),
          priorityWeights: Object.values(PriorityWeight).map((value) => ({
            __typename: "LocalizedPriorityWeight" as const,
            ...toLocalizedEnum(value),
          })),
          workRegions: Object.values(WorkRegion).map((value) => ({
            __typename: "LocalizedWorkRegion" as const,
            ...toLocalizedEnum(value),
          })),
        },
      },
    },
  },
} satisfies Meta<typeof TalentRequestMatchesTable>;

export default meta;

export const Default: StoryObj<typeof TalentRequestMatchesTable> = {};
