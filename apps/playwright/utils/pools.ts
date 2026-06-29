import type {
  AssessmentStep,
  AssessmentStepInput,
  CreatePoolSkillInput,
  LocalizedString,
  Pool,
  PoolSkill,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import {
  AssessmentStepType,
  PoolAreaOfSelection,
  PoolLanguage,
  PoolOpportunityLength,
  PoolSkillType,
  PublishingGroup,
  SecurityStatus,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getCommunities } from "./communities";
import { getClassifications } from "./classification";
import { getDepartments } from "./departments";
import { getSkills } from "./skills";
import { getWorkStreams } from "./workStreams";

const defaultPool: Partial<UpdatePoolInput> = {
  closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
  yourImpact: {
    en: "test impact EN",
    fr: "test impact FR",
  },
  keyTasks: { en: "key task EN", fr: "key task FR" },
  language: PoolLanguage.Various,
  securityClearance: SecurityStatus.Secret,
  opportunityLength: PoolOpportunityLength.Various,
  location: {
    en: "test location EN",
    fr: "test location FR",
  },
  isRemote: true,
  publishingGroup: PublishingGroup.ItJobs,
  areaOfSelection: PoolAreaOfSelection.Public,
  selectionLimitations: [],
  contactEmail: "test@email.com",
};

const Test_CreatePoolMutationDocument = /* GraphQL */ `
  mutation Test_CreatePool(
    $userId: ID!
    $communityId: ID!
    $pool: CreatePoolInput!
  ) {
    createPool(userId: $userId, communityId: $communityId, pool: $pool) {
      id
      name {
        en
        fr
      }
      community {
        id
      }
    }
  }
`;

interface CreatePoolArgs {
  userId: string;
  teamId?: string;
  communityId?: string;
  classificationId?: string;
  departmentId?: string;
}

export const createPool: GraphQLRequestFunc<Pool, CreatePoolArgs> = async (
  ctx,
  { userId, ...opts },
) => {
  const communities = await getCommunities(ctx, {});
  const firstCommunity =
    communities.find((c) => c?.name?.en?.includes("Digital")) ?? communities[0];

  const teamId = opts.teamId ?? firstCommunity?.teamIdForRoleAssignment ?? "";
  const communityId = opts.communityId ?? firstCommunity.id ?? "";

  let classificationId = opts.classificationId;
  if (!classificationId) {
    const classifications = await getClassifications(ctx, {});
    classificationId = classifications[0].id;
  }

  let departmentId = opts.departmentId;
  if (!departmentId) {
    const departments = await getDepartments(ctx, {});
    departmentId = departments[0].id;
  }

  return ctx
    .post<GraphQLResponse<"createPool", Pool>>(
      Test_CreatePoolMutationDocument,
      {
        isPrivileged: true,
        variables: {
          userId,
          teamId,
          communityId,
          pool: {
            classification: { connect: classificationId },
            department: { connect: departmentId },
          },
        },
      },
    )
    .then((res) => res.createPool);
};

const Test_UpdatePoolMutationDocument = /* GraphQL */ `
  mutation Test_UpdatePool($poolId: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $poolId, pool: $pool) {
      id
    }
  }
`;

interface UpdatePoolArgs {
  poolId: string;
  pool: UpdatePoolInput;
}

export const updatePool: GraphQLRequestFunc<Pool, UpdatePoolArgs> = async (
  ctx,
  { poolId, pool },
) => {
  return ctx
    .post<GraphQLResponse<"updatePool", Pool>>(
      Test_UpdatePoolMutationDocument,
      {
        isPrivileged: true,
        variables: {
          poolId,
          pool,
        },
      },
    )
    .then((res) => {
      return res.updatePool;
    });
};

const Test_CreatePoolSkillMutationDocument = /* GraphQL */ `
  mutation Test_CreatePoolSkill($poolSkill: CreatePoolSkillInput!) {
    createPoolSkill(poolSkill: $poolSkill) {
      id
    }
  }
`;

interface CreatePoolSkillArgs {
  poolSkill: CreatePoolSkillInput;
}

export const createPoolSkill: GraphQLRequestFunc<
  PoolSkill,
  CreatePoolSkillArgs
> = async (ctx, { poolSkill }) => {
  let skillId: string | undefined = poolSkill.skillId;
  if (!skillId) {
    const technicalSkill = await getSkills(ctx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });
    skillId = technicalSkill?.id;
  }

  return ctx
    .post<GraphQLResponse<"createPoolSkill", PoolSkill>>(
      Test_CreatePoolSkillMutationDocument,
      {
        isPrivileged: true,
        variables: {
          poolSkill,
        },
      },
    )
    .then((res) => {
      return res.createPoolSkill;
    });
};

const Test_PublishPoolMutationDocument = /* GraphQL */ `
  mutation Test_PublishPool($id: ID!) {
    publishPool(id: $id) {
      id
      publishedAt
    }
  }
`;

export const publishPool: GraphQLRequestFunc<Pool, string> = async (
  ctx,
  id,
) => {
  return ctx
    .post<GraphQLResponse<"publishPool", Pool>>(
      Test_PublishPoolMutationDocument,
      {
        isPrivileged: true,
        variables: { id },
      },
    )
    .then((res) => res.publishPool);
};

const Test_AddAssessmentStepMutationDocument = /* GraphQL */ `
  mutation Test_AddAssessmentStep(
    $poolId: UUID!
    $assessmentStep: AssessmentStepInput!
  ) {
    createAssessmentStep(poolId: $poolId, assessmentStep: $assessmentStep) {
      id
    }
  }
`;
interface AddAssessmentPlanToPoolArgs {
  poolId: string;
  assessmentStep: AssessmentStepInput;
}

export const createAssessmentStep: GraphQLRequestFunc<
  AssessmentStep,
  AddAssessmentPlanToPoolArgs
> = async (ctx, { poolId, assessmentStep }) => {
  return ctx
    .post<GraphQLResponse<"createAssessmentStep", AssessmentStep>>(
      Test_AddAssessmentStepMutationDocument,
      {
        isPrivileged: true,
        variables: {
          poolId,
          assessmentStep,
        },
      },
    )
    .then((res) => {
      return res.createAssessmentStep;
    });
};

const Test_PoolSkillsQueryDocument = /* GraphQL */ `
  query PoolSkills($poolId: UUID!) {
    pool(id: $poolId) {
      id
      poolSkills {
        id
        skill {
          id
          name {
            en
            fr
          }
          category {
            value
          }
        }
      }
    }
  }
`;

interface GetPoolSkillsArgs {
  poolId: string;
  categories?: SkillCategory[];
}

/**
 * Get Pool Skills
 *
 * Get all pool skills for a specific pool.
 */
export const getPoolSkills: GraphQLRequestFunc<
  PoolSkill[],
  GetPoolSkillsArgs
> = async (ctx, { poolId, categories }) => {
  const poolSkills = await ctx
    .post<GraphQLResponse<"pool", { id: string; poolSkills: PoolSkill[] }>>(
      Test_PoolSkillsQueryDocument,
      {
        isPrivileged: true,
        variables: { poolId },
      },
    )
    .then((res) => res.pool.poolSkills);
  return poolSkills.filter(
    (ps) =>
      ps.skill?.category?.value !== undefined &&
      (!categories || categories.includes(ps.skill.category.value)),
  );
};

interface CreateAndPublishPoolArgs {
  userId: string;
  teamId?: string;
  communityId?: string;
  name?: LocalizedString;
  classificationId?: string;
  departmentId?: string;
  workStreamId?: string;
  skillIds?: string[];
  input?: UpdatePoolInput;
}

export const createAndPublishPool: GraphQLRequestFunc<
  Pool,
  CreateAndPublishPoolArgs
> = async (
  ctx,
  {
    userId,
    skillIds,
    name,
    teamId,
    communityId,
    classificationId,
    departmentId,
    workStreamId,
    input,
  },
) => {
  return createPool(ctx, {
    userId,
    teamId,
    communityId,
    classificationId,
    departmentId,
  }).then(async (pool) => {
    let selectedWorkStreamId = workStreamId;
    if (!selectedWorkStreamId) {
      const workStreams = await getWorkStreams(ctx, {});
      selectedWorkStreamId = workStreams.find(
        (ws) => ws.community?.id == pool.community?.id,
      )?.id;
    }
    if (!selectedWorkStreamId) {
      throw new Error("Failed to pick a work stream for the new pool.");
    }

    await updatePool(ctx, {
      poolId: pool.id,
      pool: {
        ...defaultPool,
        name: name ?? {
          en: `Playwright Test Pool EN ${Date.now().valueOf()}`,
          fr: `Playwright Test Pool FR ${Date.now().valueOf()}`,
        },
        ...input,
        workStream: { connect: selectedWorkStreamId },
      },
    });

    if (skillIds) {
      await Promise.all(
        skillIds.map(async (skillId) => {
          await createPoolSkill(ctx, {
            poolSkill: {
              poolId: pool.id,
              skillId,
              type: PoolSkillType.Essential,
              requiredLevel: SkillLevel.Beginner,
            },
          });
        }),
      );
    } else {
      const technicalSkill = await getSkills(ctx, {}).then((skills) => {
        return skills.find(
          (skill) => skill.category.value === SkillCategory.Technical,
        );
      });
      const skillId = technicalSkill?.id;
      if (skillId) {
        await createPoolSkill(ctx, {
          poolSkill: {
            poolId: pool.id,
            skillId,
            type: PoolSkillType.Essential,
            requiredLevel: SkillLevel.Beginner,
          },
        });
      }
    }
    const poolSkillsID = await getPoolSkills(ctx, { poolId: pool.id }).then(
      (poolSkills) => poolSkills.map((ps) => ps.id),
    );
    await createAssessmentStep(ctx, {
      poolId: pool.id,
      assessmentStep: {
        type: AssessmentStepType.InterviewIndividual,
        title: {
          en: "Test Individual Interview [EN]",
          fr: "Test Individual Interview [FR]",
        },
        poolSkills: {
          sync: poolSkillsID,
        },
      },
    });
    return await publishPool(ctx, pool.id);
  });
};

const Test_DeletePoolMutationDocument = /* GraphQL */ `
  mutation Test_DeletePool($id: ID!) {
    deletePool(id: $id) {
      id
    }
  }
`;

interface DeletePoolArgs {
  id: string;
}

export const deletePool: GraphQLRequestFunc<Pool, DeletePoolArgs> = async (
  ctx,
  { id },
) => {
  return await ctx
    .post<GraphQLResponse<"deletePool", Pool>>(
      Test_DeletePoolMutationDocument,
      {
        isPrivileged: true,
        variables: { id },
      },
    )
    .then((res) => res.deletePool);
};

export const createAndPublishInternalPool: GraphQLRequestFunc<
  Pool,
  CreateAndPublishPoolArgs
> = async (ctx, args) => {
  return createAndPublishPool(ctx, {
    ...args,
    input: {
      ...args.input,
      areaOfSelection: PoolAreaOfSelection.Employees,
    },
  });
};

const Test_ChangePoolClosingDateMutationDocument = /* GraphQL */ `
  mutation Test_ChangePoolClosingDate($id: ID!, $closingDate: DateTime!) {
    changePoolClosingDate(id: $id, closingDate: $closingDate) {
      id
    }
  }
`;

interface ChangePoolClosingDateArgs {
  id: string;
  closingDate: string;
}

export const changePoolClosingDate: GraphQLRequestFunc<
  Pool,
  ChangePoolClosingDateArgs
> = async (ctx, { id, closingDate }) => {
  return await ctx
    .post<GraphQLResponse<"changePoolClosingDate", Pool>>(
      Test_ChangePoolClosingDateMutationDocument,
      {
        isPrivileged: true,
        variables: { id, closingDate },
      },
    )
    .then((res) => res.changePoolClosingDate);
};
