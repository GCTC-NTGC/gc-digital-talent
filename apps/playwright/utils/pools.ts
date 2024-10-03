import {
  CreatePoolSkillInput,
  LocalizedString,
  Pool,
  PoolAreaOfSelection,
  PoolLanguage,
  PoolOpportunityLength,
  PoolSkill,
  PoolSkillType,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
  SkillCategory,
  SkillLevel,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getDCM } from "./teams";
import { getCommunities } from "./communities";
import { getClassifications } from "./classification";
import { getDepartments } from "./departments";
import { getSkills } from "./skills";

const defaultPool: Partial<UpdatePoolInput> = {
  stream: PoolStream.BusinessAdvisoryServices,
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
};

const Test_CreatePoolMutationDocument = /* GraphQL */ `
  mutation Test_CreatePool(
    $userId: ID!
    $teamId: ID!
    $communityId: ID!
    $pool: CreatePoolInput!
  ) {
    createPool(
      userId: $userId
      teamId: $teamId
      communityId: $communityId
      pool: $pool
    ) {
      id
      name {
        en
        fr
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
  let teamId = opts.teamId;
  if (!teamId) {
    const team = await getDCM(ctx, {});
    teamId = team?.id;
  }

  let communityId = opts.communityId;
  if (!communityId) {
    const communities = await getCommunities(ctx, {});
    communityId = communities[0].id;
  }

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
    .post(Test_CreatePoolMutationDocument, {
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
    })
    .then((res: GraphQLResponse<"createPool", Pool>) => res.createPool);
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
    .post(Test_UpdatePoolMutationDocument, {
      isPrivileged: true,
      variables: {
        poolId,
        pool,
      },
    })
    .then((res: GraphQLResponse<"updatePool", Pool>) => {
      return res.updatePool;
    });
};

const Test_CreatePoolSkillMutationDocument = /* GraphQL */ `
  mutation Test_CreatePoolSkill(
    $poolId: ID!
    $skillId: ID!
    $poolSkill: CreatePoolSkillInput!
  ) {
    createPoolSkill(poolId: $poolId, skillId: $skillId, poolSkill: $poolSkill) {
      id
    }
  }
`;

interface CreatePoolSkillArgs {
  poolId: string;
  skillId?: string;
  poolSkill: CreatePoolSkillInput;
}

export const createPoolSkill: GraphQLRequestFunc<
  PoolSkill,
  CreatePoolSkillArgs
> = async (ctx, { poolId, poolSkill, ...opts }) => {
  let skillId = opts?.skillId;
  if (!skillId) {
    const technicalSkill = await getSkills(ctx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });
    skillId = technicalSkill?.id;
  }

  return ctx
    .post(Test_CreatePoolSkillMutationDocument, {
      isPrivileged: true,
      variables: {
        poolId,
        skillId,
        poolSkill,
      },
    })
    .then((res: GraphQLResponse<"createPoolSkill", PoolSkill>) => {
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
    .post(Test_PublishPoolMutationDocument, {
      isPrivileged: true,
      variables: { id },
    })
    .then((res: GraphQLResponse<"publishPool", Pool>) => res.publishPool);
};

interface CreateAndPublishPoolArgs {
  userId: string;
  teamId?: string;
  communityId?: string;
  name?: LocalizedString;
  classificationId?: string;
  departmentId?: string;
  skillId?: string;
  input?: UpdatePoolInput;
}

export const createAndPublishPool: GraphQLRequestFunc<
  Pool,
  CreateAndPublishPoolArgs
> = async (
  ctx,
  {
    userId,
    skillId,
    name,
    teamId,
    communityId,
    classificationId,
    departmentId,
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
    await updatePool(ctx, {
      poolId: pool.id,
      pool: {
        ...defaultPool,
        name: name ?? {
          en: `Playwright Test Pool EN ${Date.now().valueOf()}`,
          fr: `Playwright Test Pool FR ${Date.now().valueOf()}`,
        },
        ...input,
      },
    });

    await createPoolSkill(ctx, {
      poolId: pool.id,
      skillId,
      poolSkill: {
        type: PoolSkillType.Essential,
        requiredLevel: SkillLevel.Beginner,
      },
    });

    return await publishPool(ctx, pool.id);
  });
};
