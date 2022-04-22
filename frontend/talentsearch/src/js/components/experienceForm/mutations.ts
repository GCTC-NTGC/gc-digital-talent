import {
  useCreateAwardExperienceMutation,
  useCreateCommunityExperienceMutation,
  useCreateEducationExperienceMutation,
  useCreatePersonalExperienceMutation,
  useCreateWorkExperienceMutation,
  useUpdateAwardExperienceMutation,
  useUpdateCommunityExperienceMutation,
  useUpdateEducationExperienceMutation,
  useUpdatePersonalExperienceMutation,
} from "../../api/generated";
import type {
  ExperienceDetailsSubmissionData,
  ExperienceMutationArgs,
  ExperienceType,
} from "./types";

type ExperienceMutationType = "create" | "update";

const useExperienceMutations = (
  experienceType: ExperienceType,
  mutationType: ExperienceMutationType,
) => {
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
    return { id, [args[experienceType]]: values } as ExperienceMutationArgs;
  };

  const [, executeCreateAwardMutation] = useCreateAwardExperienceMutation();
  const [, executeCreateCommunityMutation] =
    useCreateCommunityExperienceMutation();
  const [, executeCreateEducationMutation] =
    useCreateEducationExperienceMutation();
  const [, executeCreatePersonalMutation] =
    useCreatePersonalExperienceMutation();
  const [, executeCreateWorkMutation] = useCreateWorkExperienceMutation();

  const [, executeUpdateAwardMutation] = useUpdateAwardExperienceMutation();
  const [, executeUpdateCommunityMutation] =
    useUpdateCommunityExperienceMutation();
  const [, executeUpdateEducationMutation] =
    useUpdateEducationExperienceMutation();
  const [, executeUpdatePersonalMutation] =
    useUpdatePersonalExperienceMutation();
  const [, executeUpdateWorkMutation] = useUpdateAwardExperienceMutation();

  const mutations = {
    create: {
      award: executeCreateAwardMutation,
      community: executeCreateCommunityMutation,
      education: executeCreateEducationMutation,
      personal: executeCreatePersonalMutation,
      work: executeCreateWorkMutation,
    },
    update: {
      award: executeUpdateAwardMutation,
      community: executeUpdateCommunityMutation,
      education: executeUpdateEducationMutation,
      personal: executeUpdatePersonalMutation,
      work: executeUpdateWorkMutation,
    },
  };

  return {
    executeMutation: mutations[mutationType][experienceType],
    getMutationArgs: getArgs,
  };
};

export default useExperienceMutations;
