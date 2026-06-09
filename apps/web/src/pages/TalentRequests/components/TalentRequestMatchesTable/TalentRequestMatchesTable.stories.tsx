import type { StoryObj, Meta } from "@storybook/react-vite";

import {
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PriorityWeight,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  fakeClassifications,
  fakeDepartments,
  fakeSkills,
  fakeWorkStreams,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";

import TalentRequestMatchesTable from "./TalentRequestMatchesTable";

const meta = {
  component: TalentRequestMatchesTable,
  parameters: {
    apiResponses: {
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
