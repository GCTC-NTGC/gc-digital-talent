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
  useUpdateWorkExperienceMutation,
  useDeleteAwardExperienceMutation,
  useDeleteCommunityExperienceMutation,
  useDeleteEducationExperienceMutation,
  useDeletePersonalExperienceMutation,
  useDeleteWorkExperienceMutation,
} from "../../api/generated";
import type {
  ExperienceDetailsSubmissionData,
  ExperienceMutationArgs,
  ExperienceType,
} from "./types";

type ExperienceMutationType = "create" | "update";

export const useExperienceMutations = (
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
  const [, executeUpdateWorkMutation] = useUpdateWorkExperienceMutation();

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

export const useDeleteExperienceMutation = (experienceType: ExperienceType) => {
  const [, executeDeleteAwardMutation] = useDeleteAwardExperienceMutation();
  const [, executeDeleteCommunityMutation] =
    useDeleteCommunityExperienceMutation();
  const [, executeDeleteEducationMutation] =
    useDeleteEducationExperienceMutation();
  const [, executeDeletePersonalMutation] =
    useDeletePersonalExperienceMutation();
  const [, executeDeleteWorkMutation] = useDeleteWorkExperienceMutation();

  const mutations = {
    award: executeDeleteAwardMutation,
    community: executeDeleteCommunityMutation,
    education: executeDeleteEducationMutation,
    personal: executeDeletePersonalMutation,
    work: executeDeleteWorkMutation,
  };

  return {
    executeDeletionMutation: mutations[experienceType],
  };
};
