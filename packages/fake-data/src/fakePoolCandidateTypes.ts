import type { PoolCandidate } from "@gc-digital-talent/graphql";

import type {
  GeneratedAwardExperience,
  GeneratedCommunityExperience,
  GeneratedEducationExperience,
  GeneratedPersonalExperience,
  GeneratedWorkExperience,
} from "./fakeExperiences";

export type GeneratedPoolCandidate = PoolCandidate & {
  __typename: "PoolCandidate";
  educationRequirementExperiences: (
    | GeneratedAwardExperience
    | GeneratedCommunityExperience
    | GeneratedEducationExperience
    | GeneratedPersonalExperience
    | GeneratedWorkExperience
  )[];
};
