import { Update } from "history";
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

type CreateMutation =
  | ReturnType<typeof useCreateAwardExperienceMutation>[1]
  | ReturnType<typeof useCreateCommunityExperienceMutation>[1]
  | ReturnType<typeof useCreateEducationExperienceMutation>[1]
  | ReturnType<typeof useCreatePersonalExperienceMutation>[1]
  | ReturnType<typeof useCreateWorkExperienceMutation>[1];

type UpdateMutation =
  | ReturnType<typeof useUpdateAwardExperienceMutation>[1]
  | ReturnType<typeof useUpdateCommunityExperienceMutation>[1]
  | ReturnType<typeof useUpdateEducationExperienceMutation>[1]
  | ReturnType<typeof useUpdatePersonalExperienceMutation>[1]
  | ReturnType<typeof useUpdateWorkExperienceMutation>[1];

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

  const createMutations = new Map<ExperienceType, CreateMutation>();
  createMutations.set("award", executeCreateAwardMutation);
  createMutations.set("community", executeCreateCommunityMutation);
  createMutations.set("community", executeCreateCommunityMutation);
  createMutations.set("education", executeCreateEducationMutation);
  createMutations.set("personal", executeCreatePersonalMutation);
  createMutations.set("work", executeCreateWorkMutation);

  const updateMutations = new Map<ExperienceType, UpdateMutation>();
  updateMutations.set("award", executeUpdateAwardMutation);
  updateMutations.set("community", executeUpdateCommunityMutation);
  updateMutations.set("community", executeUpdateCommunityMutation);
  updateMutations.set("education", executeUpdateEducationMutation);
  updateMutations.set("personal", executeUpdatePersonalMutation);
  updateMutations.set("work", executeUpdateWorkMutation);

  const mutations = {
    create: createMutations,
    update: updateMutations,
  };

  return {
    executeMutation: experienceType
      ? mutations[mutationType].get(experienceType)
      : null,
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
