export const Test_CreatePoolMutationDocument = /* GraphQL */ `
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

export const Test_UpdatePoolMutationDocument = /* GraphQL */ `
  mutation Test_UpdatePool($poolId: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $poolId, pool: $pool) {
      id
    }
  }
`;

export const Test_CreatePoolSkillMutationDocument = /* GraphQL */ `
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

export const Test_PublishPoolMutationDocument = /* GraphQL */ `
  mutation Test_PublishPool($id: ID!) {
    publishPool(id: $id) {
      id
      publishedAt
    }
  }
`;
