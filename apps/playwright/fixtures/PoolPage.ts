import {
  Classification,
  CreatePoolInput,
  CreatePoolSkillInput,
  Department,
  Pool,
  PoolLanguage,
  PoolOpportunityLength,
  PoolSkill,
  PoolSkillType,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
  Skill,
  SkillLevel,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import {
  Test_CreatePoolMutationDocument,
  Test_CreatePoolSkillMutationDocument,
  Test_PublishPoolMutationDocument,
  Test_UpdatePoolMutationDocument,
} from "~/utils/pools";
import { GraphQLResponse } from "~/utils/graphql";

import AppPage from "./AppPage";

type CreateAndPublishPoolArgs = {
  userId: string;
  teamId: string;
  communityId: string;
  name: string;
  classification: Classification;
  department: Department;
  skill: Skill;
};

/**
 * Pool Page
 *
 * Page containing utilities for interacting with pools
 */
class PoolPage extends AppPage {
  async gotoIndex() {
    await this.page.goto("/admin/pools");
  }

  async createPool(
    userId: string,
    teamId: string,
    communityId: string,
    pool: CreatePoolInput,
  ): Promise<Pool> {
    return this.graphqlRequest(Test_CreatePoolMutationDocument, {
      userId,
      teamId,
      communityId,
      pool,
    }).then((res: GraphQLResponse<"createPool", Pool>) => res.createPool);
  }

  async updatePool(poolId: string, pool: UpdatePoolInput): Promise<Pool> {
    return this.graphqlRequest(Test_UpdatePoolMutationDocument, {
      poolId,
      pool,
    }).then((res: GraphQLResponse<"updatePool", Pool>) => {
      return res.updatePool;
    });
  }

  async createPoolSkill(
    poolId: string,
    skillId: string,
    poolSkill: CreatePoolSkillInput,
  ): Promise<PoolSkill> {
    return this.graphqlRequest(Test_CreatePoolSkillMutationDocument, {
      poolId,
      skillId,
      poolSkill,
    }).then((res: GraphQLResponse<"createPoolSkill", PoolSkill>) => {
      return res.createPoolSkill;
    });
  }

  async publishPool(poolId: string): Promise<Pool> {
    return this.graphqlRequest(Test_PublishPoolMutationDocument, {
      id: poolId,
    }).then((res: GraphQLResponse<"publishPool", Pool>) => res.publishPool);
  }

  async createAndPublishPool({
    userId,
    teamId,
    communityId,
    name,
    classification,
    department,
    skill,
  }: CreateAndPublishPoolArgs): Promise<Pool> {
    let pool = await this.createPool(userId, teamId, communityId, {
      classification: { connect: classification.id },
      department: { connect: department.id },
    });

    pool = await this.updatePool(pool.id, {
      name: {
        en: name || `Playwright Test Pool EN ${Date.now().valueOf()}`,
        fr: `Playwright Test Pool FR ${Date.now().valueOf()}`,
      },
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
    });

    await this.createPoolSkill(pool.id, skill.id, {
      type: PoolSkillType.Essential,
      requiredLevel: SkillLevel.Beginner,
    });

    pool = await this.publishPool(pool.id);

    return pool;
  }
}

export default PoolPage;
