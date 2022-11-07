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
  mutationType: ExperienceMutationType,
  experienceType?: ExperienceType,
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
    return {
      id,
      [args[experienceType || "personal"]]: values,
    } as ExperienceMutationArgs;
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
    executeMutation: mutations[mutationType][experienceType || "personal"],
    getMutationArgs: getArgs,
  };
};

type DeleteMutation =
  | ReturnType<typeof useDeleteAwardExperienceMutation>[1]
  | ReturnType<typeof useDeleteCommunityExperienceMutation>[1]
  | ReturnType<typeof useDeleteEducationExperienceMutation>[1]
  | ReturnType<typeof useDeletePersonalExperienceMutation>[1]
  | ReturnType<typeof useDeleteWorkExperienceMutation>[1];

export const useDeleteExperienceMutation = (
  experienceType?: ExperienceType,
) => {
  const [, executeDeleteAwardMutation] = useDeleteAwardExperienceMutation();
  const [, executeDeleteCommunityMutation] =
    useDeleteCommunityExperienceMutation();
  const [, executeDeleteEducationMutation] =
    useDeleteEducationExperienceMutation();
  const [, executeDeletePersonalMutation] =
    useDeletePersonalExperienceMutation();
  const [, executeDeleteWorkMutation] = useDeleteWorkExperienceMutation();

  const mutations = new Map<ExperienceType, DeleteMutation>();

  mutations.set("award", executeDeleteAwardMutation);
  mutations.set("community", executeDeleteCommunityMutation);
  mutations.set("community", executeDeleteCommunityMutation);
  mutations.set("education", executeDeleteEducationMutation);
  mutations.set("personal", executeDeletePersonalMutation);
  mutations.set("work", executeDeleteWorkMutation);

  return experienceType ? mutations.get(experienceType) : null;
};
