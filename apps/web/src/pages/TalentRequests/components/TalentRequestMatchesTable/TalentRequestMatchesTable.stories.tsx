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
  sources: [
    toLocalizedEnum(
      TalentRequestSource.QualifiedInPool,
      "LocalizedTalentRequestSource",
    ),
  ],
  skillCount: user.userSkills?.length ?? 0,
}));

const meta = {
  component: TalentRequestMatchesTable,
  args: {
    query: talentRequestFragment,
    skillsQuery: [],
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
            (value) => toLocalizedEnum(value, "LocalizedFlexibleWorkLocation"),
          ),
          languageAbilities: Object.values(LanguageAbility).map((value) =>
            toLocalizedEnum(value, "LocalizedLanguageAbility"),
          ),
          operationalRequirements: Object.values(OperationalRequirement).map(
            (value) =>
              toLocalizedEnum(value, "LocalizedOperationalRequirement"),
          ),
          priorityWeights: Object.values(PriorityWeight).map((value) =>
            toLocalizedEnum(value, "LocalizedPriorityWeight"),
          ),
          workRegions: Object.values(WorkRegion).map((value) =>
            toLocalizedEnum(value, "LocalizedWorkRegion"),
          ),
        },
      },
    },
  },
} satisfies Meta<typeof TalentRequestMatchesTable>;

export default meta;

export const Default: StoryObj<typeof TalentRequestMatchesTable> = {};
