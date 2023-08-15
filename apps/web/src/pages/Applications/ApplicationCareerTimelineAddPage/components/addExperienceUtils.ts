/* eslint-disable import/prefer-default-export */
import {
  CreateAwardExperienceMutation,
  CreatePersonalExperienceMutation,
  CreateCommunityExperienceMutation,
  CreateEducationExperienceMutation,
  CreateWorkExperienceMutation,
} from "~/api/generated";

type CreateExperienceMutation =
  | CreateAwardExperienceMutation
  | CreateCommunityExperienceMutation
  | CreateEducationExperienceMutation
  | CreatePersonalExperienceMutation
  | CreateWorkExperienceMutation;

// typesafe field descriminators
const awardDiscriminator: keyof CreateAwardExperienceMutation =
  "createAwardExperience";
const communityDiscriminator: keyof CreateCommunityExperienceMutation =
  "createCommunityExperience";
const eductionDiscriminator: keyof CreateEducationExperienceMutation =
  "createEducationExperience";
const personalDiscriminator: keyof CreatePersonalExperienceMutation =
  "createPersonalExperience";
const workDiscriminator: keyof CreateWorkExperienceMutation =
  "createWorkExperience";

// type guards based on discriminators
const isAwardExperience = (
  mut: CreateExperienceMutation,
): mut is CreateAwardExperienceMutation => awardDiscriminator in mut;
const isCommunityExperience = (
  mut: CreateExperienceMutation,
): mut is CreateCommunityExperienceMutation => communityDiscriminator in mut;
const isEducationExperience = (
  mut: CreateExperienceMutation,
): mut is CreateEducationExperienceMutation => eductionDiscriminator in mut;
const isPersonalExperience = (
  mut: CreateExperienceMutation,
): mut is CreatePersonalExperienceMutation => personalDiscriminator in mut;
const isWorkExperience = (
  mut: CreateExperienceMutation,
): mut is CreateWorkExperienceMutation => workDiscriminator in mut;

export function isSuccessfulCreate(response: {
  data?: CreateExperienceMutation;
}): boolean {
  if (response.data) {
    if (isAwardExperience(response.data)) {
      return !!response.data.createAwardExperience?.id;
    }
    if (isCommunityExperience(response.data)) {
      return !!response.data.createCommunityExperience?.id;
    }
    if (isEducationExperience(response.data)) {
      return !!response.data.createEducationExperience?.id;
    }
    if (isPersonalExperience(response.data)) {
      return !!response.data.createPersonalExperience?.id;
    }
    if (isWorkExperience(response.data)) {
      return !!response.data.createWorkExperience?.id;
    }
  }

  return false;
}
