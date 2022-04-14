import {
  useCreateAwardExperienceMutation,
  useCreateCommunityExperienceMutation,
  useCreateEducationExperienceMutation,
  useCreatePersonalExperienceMutation,
  useCreateWorkExperienceMutation,
} from "../../api/generated";
import type {
  ExperienceDetailsSubmissionData,
  ExperienceMutationArgs,
  ExperienceMutationResponse,
  ExperienceType,
} from "./types";

const useExperienceMutations = (type: ExperienceType) => {
  const args: Record<ExperienceType, string> = {
    award: "awardExperience",
    community: "communityExperience",
    education: "educationExperience",
    personal: "personalExperience",
    work: "workExperience",
  };

  const getArgs = (
    id: string,
    values: ExperienceDetailsSubmissionData,
  ): ExperienceMutationArgs => {
    return { id, [args[type]]: values } as ExperienceMutationArgs;
  };

  const [, executeAwardMutation] = useCreateAwardExperienceMutation();
  const [, executeCommunityMutation] = useCreateCommunityExperienceMutation();
  const [, executeEducationMutation] = useCreateEducationExperienceMutation();
  const [, executePersonalMutation] = useCreatePersonalExperienceMutation();
  const [, executeWorkMutation] = useCreateWorkExperienceMutation();

  const mutations = {
    award: executeAwardMutation,
    community: executeCommunityMutation,
    education: executeEducationMutation,
    personal: executePersonalMutation,
    work: executeWorkMutation,
  };

  return {
    executeMutation: mutations[type],
    getMutationArgs: getArgs,
  };
};

export default useExperienceMutations;
