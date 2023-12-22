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
  CreateAwardExperienceMutation,
  CreateCommunityExperienceMutation,
  CreateEducationExperienceMutation,
  CreatePersonalExperienceMutation,
  CreateWorkExperienceMutation,
} from "~/api/generated";
import type {
  ExperienceDetailsSubmissionData,
  ExperienceMutationArgs,
  ExperienceType,
} from "~/types/experience";

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
  experienceType?: ExperienceType | "",
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

  const [{ fetching: creatingAward }, executeCreateAwardMutation] =
    useCreateAwardExperienceMutation();
  const [{ fetching: creatingCommunity }, executeCreateCommunityMutation] =
    useCreateCommunityExperienceMutation();
  const [{ fetching: creatingEducation }, executeCreateEducationMutation] =
    useCreateEducationExperienceMutation();
  const [{ fetching: creatingPersonal }, executeCreatePersonalMutation] =
    useCreatePersonalExperienceMutation();
  const [{ fetching: creatingWork }, executeCreateWorkMutation] =
    useCreateWorkExperienceMutation();

  const [{ fetching: updatingAward }, executeUpdateAwardMutation] =
    useUpdateAwardExperienceMutation();
  const [{ fetching: updatingCommunity }, executeUpdateCommunityMutation] =
    useUpdateCommunityExperienceMutation();
  const [{ fetching: updatingEducation }, executeUpdateEducationMutation] =
    useUpdateEducationExperienceMutation();
  const [{ fetching: updatingPersonal }, executeUpdatePersonalMutation] =
    useUpdatePersonalExperienceMutation();
  const [{ fetching: updatingWork }, executeUpdateWorkMutation] =
    useUpdateWorkExperienceMutation();

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

  const mutations = new Map<
    ExperienceMutationType,
    typeof updateMutations | typeof createMutations
  >();

  mutations.set("create", createMutations);
  mutations.set("update", updateMutations);

  let executeMutation: CreateMutation | UpdateMutation | null = null;
  if (mutationType && mutations.has(mutationType)) {
    const mutationTypeMutations = mutations.get(mutationType);
    if (typeof mutationTypeMutations === "object") {
      if (experienceType && mutationTypeMutations.has(experienceType)) {
        const mutation = mutationTypeMutations.get(experienceType);
        if (typeof mutation === "function") {
          executeMutation = mutation;
        }
      }
    }
  }

  const executing: boolean =
    creatingAward ||
    creatingCommunity ||
    creatingEducation ||
    creatingPersonal ||
    creatingWork ||
    updatingAward ||
    updatingCommunity ||
    updatingEducation ||
    updatingPersonal ||
    updatingWork;

  return {
    executeMutation,
    executing,
    getMutationArgs: getArgs,
  };
};

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

  if (experienceType && mutations.has(experienceType)) {
    const mutation = mutations.get(experienceType);
    if (typeof mutation === "function") {
      return mutation;
    }
  }

  return null;
};
