import { useMutation } from "urql";

import {
  CreateAwardExperienceMutation,
  CreateCommunityExperienceMutation,
  CreateEducationExperienceMutation,
  CreatePersonalExperienceMutation,
  CreateWorkExperienceMutation,
  GovEmployeeType,
  graphql,
} from "@gc-digital-talent/graphql";

import type {
  ExperienceDetailsSubmissionData,
  ExperienceMutationArgs,
  ExperienceType,
} from "~/types/experience";

type ExperienceMutationType = "create" | "update";

const CreateAwardExperience_Mutation = graphql(/* GraphQL */ `
  mutation CreateAwardExperience(
    $id: ID!
    $awardExperience: AwardExperienceInput!
  ) {
    createAwardExperience(userId: $id, awardExperience: $awardExperience) {
      id
    }
  }
`);

const CreateCommunityExperience_Mutation = graphql(/* GraphQL */ `
  mutation CreateCommunityExperience(
    $id: ID!
    $communityExperience: CommunityExperienceInput!
  ) {
    createCommunityExperience(
      userId: $id
      communityExperience: $communityExperience
    ) {
      id
    }
  }
`);

const CreateEducationExperience_Mutation = graphql(/* GraphQL */ `
  mutation CreateEducationExperience(
    $id: ID!
    $educationExperience: EducationExperienceInput!
  ) {
    createEducationExperience(
      userId: $id
      educationExperience: $educationExperience
    ) {
      id
    }
  }
`);

const CreatePersonalExperience_Mutation = graphql(/* GraphQL */ `
  mutation CreatePersonalExperience(
    $id: ID!
    $personalExperience: PersonalExperienceInput!
  ) {
    createPersonalExperience(
      userId: $id
      personalExperience: $personalExperience
    ) {
      id
    }
  }
`);

const CreateWorkExperience_Mutation = graphql(/* GraphQL */ `
  mutation CreateWorkExperience(
    $id: ID!
    $workExperience: WorkExperienceInput!
  ) {
    createWorkExperience(userId: $id, workExperience: $workExperience) {
      id
    }
  }
`);

const UpdateAwardExperience_Mutation = graphql(/* GraphQL */ `
  mutation UpdateAwardExperience(
    $id: ID!
    $awardExperience: AwardExperienceInput!
  ) {
    updateAwardExperience(id: $id, awardExperience: $awardExperience) {
      id
    }
  }
`);

const UpdateCommunityExperience_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunityExperience(
    $id: ID!
    $communityExperience: CommunityExperienceInput!
  ) {
    updateCommunityExperience(
      id: $id
      communityExperience: $communityExperience
    ) {
      id
    }
  }
`);

const UpdateEducationExperience_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEducationExperience(
    $id: ID!
    $educationExperience: EducationExperienceInput!
  ) {
    updateEducationExperience(
      id: $id
      educationExperience: $educationExperience
    ) {
      id
    }
  }
`);

const UpdatePersonalExperience_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePersonalExperience(
    $id: ID!
    $personalExperience: PersonalExperienceInput!
  ) {
    updatePersonalExperience(id: $id, personalExperience: $personalExperience) {
      id
    }
  }
`);

const UpdateWorkExperience_Mutation = graphql(/* GraphQL */ `
  mutation UpdateWorkExperience(
    $id: ID!
    $workExperience: WorkExperienceInput!
  ) {
    updateWorkExperience(id: $id, workExperience: $workExperience) {
      id
    }
  }
`);

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
    // users may have invalid WorkExperience state with govEmploymentType TERM and non-null govPositionType
    let massagedValues = values;
    if (
      experienceType === "work" &&
      !!massagedValues.govEmploymentType &&
      massagedValues.govEmploymentType !== GovEmployeeType.Indeterminate
    ) {
      massagedValues.govPositionType = null;
    }

    return {
      id,
      ...(!!experienceType && {
        [args[experienceType]]: massagedValues,
      }),
    } as ExperienceMutationArgs;
  };

  const [{ fetching: creatingAward }, executeCreateAwardMutation] = useMutation(
    CreateAwardExperience_Mutation,
  );
  const [{ fetching: creatingCommunity }, executeCreateCommunityMutation] =
    useMutation(CreateCommunityExperience_Mutation);
  const [{ fetching: creatingEducation }, executeCreateEducationMutation] =
    useMutation(CreateEducationExperience_Mutation);
  const [{ fetching: creatingPersonal }, executeCreatePersonalMutation] =
    useMutation(CreatePersonalExperience_Mutation);
  const [{ fetching: creatingWork }, executeCreateWorkMutation] = useMutation(
    CreateWorkExperience_Mutation,
  );

  type CreateMutation =
    | typeof executeCreateAwardMutation
    | typeof executeCreateCommunityMutation
    | typeof executeCreateEducationMutation
    | typeof executeCreatePersonalMutation
    | typeof executeCreateWorkMutation;

  const createMutations = new Map<ExperienceType, CreateMutation>();
  createMutations.set("award", executeCreateAwardMutation);
  createMutations.set("community", executeCreateCommunityMutation);
  createMutations.set("community", executeCreateCommunityMutation);
  createMutations.set("education", executeCreateEducationMutation);
  createMutations.set("personal", executeCreatePersonalMutation);
  createMutations.set("work", executeCreateWorkMutation);

  const [{ fetching: updatingAward }, executeUpdateAwardMutation] = useMutation(
    UpdateAwardExperience_Mutation,
  );
  const [{ fetching: updatingCommunity }, executeUpdateCommunityMutation] =
    useMutation(UpdateCommunityExperience_Mutation);
  const [{ fetching: updatingEducation }, executeUpdateEducationMutation] =
    useMutation(UpdateEducationExperience_Mutation);
  const [{ fetching: updatingPersonal }, executeUpdatePersonalMutation] =
    useMutation(UpdatePersonalExperience_Mutation);
  const [{ fetching: updatingWork }, executeUpdateWorkMutation] = useMutation(
    UpdateWorkExperience_Mutation,
  );

  type UpdateMutation =
    | typeof executeUpdateAwardMutation
    | typeof executeUpdateCommunityMutation
    | typeof executeUpdateEducationMutation
    | typeof executeUpdatePersonalMutation
    | typeof executeUpdateWorkMutation;

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

const DeleteAwardExperience_Mutation = graphql(/* GraphQL */ `
  mutation DeleteAwardExperience($id: ID!) {
    deleteAwardExperience(id: $id) {
      id
    }
  }
`);

const DeleteCommunityExperience_Mutation = graphql(/* GraphQL */ `
  mutation DeleteCommunityExperience($id: ID!) {
    deleteCommunityExperience(id: $id) {
      id
    }
  }
`);

const DeleteEducationExperience_Mutation = graphql(/* GraphQL */ `
  mutation DeleteEducationExperience($id: ID!) {
    deleteEducationExperience(id: $id) {
      id
    }
  }
`);

const DeletePersonalExperience_Mutation = graphql(/* GraphQL */ `
  mutation DeletePersonalExperience($id: ID!) {
    deletePersonalExperience(id: $id) {
      id
    }
  }
`);

const DeleteWorkExperience_Mutation = graphql(/* GraphQL */ `
  mutation DeleteWorkExperience($id: ID!) {
    deleteWorkExperience(id: $id) {
      id
    }
  }
`);

export const useDeleteExperienceMutation = (
  experienceType?: ExperienceType,
) => {
  const [, executeDeleteAwardMutation] = useMutation(
    DeleteAwardExperience_Mutation,
  );
  const [, executeDeleteCommunityMutation] = useMutation(
    DeleteCommunityExperience_Mutation,
  );
  const [, executeDeleteEducationMutation] = useMutation(
    DeleteEducationExperience_Mutation,
  );
  const [, executeDeletePersonalMutation] = useMutation(
    DeletePersonalExperience_Mutation,
  );
  const [, executeDeleteWorkMutation] = useMutation(
    DeleteWorkExperience_Mutation,
  );

  type DeleteMutation =
    | typeof executeDeleteAwardMutation
    | typeof executeDeleteCommunityMutation
    | typeof executeDeleteEducationMutation
    | typeof executeDeletePersonalMutation
    | typeof executeDeleteWorkMutation;

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
