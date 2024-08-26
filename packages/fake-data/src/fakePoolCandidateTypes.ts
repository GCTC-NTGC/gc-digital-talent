import { PoolCandidate } from "@gc-digital-talent/graphql";

import {
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
