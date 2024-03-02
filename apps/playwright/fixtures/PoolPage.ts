import {
  Classification,
  CreatePoolInput,
  Pool,
  PoolLanguage,
  PoolOpportunityLength,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
  Skill,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import {
  Test_CreatePoolMutationDocument,
  Test_PublishPoolMutationDocument,
  Test_UpdatePoolMutationDocument,
} from "~/utils/pools";
import { GraphQLResponse } from "~/utils/graphql";

import AppPage from "./AppPage";

type CreateAndPublishPoolArgs = {
  userId: string;
  teamId: string;
  name: string;
  classification: Classification;
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
    pool: CreatePoolInput,
  ): Promise<Pool> {
    return this.graphqlRequest(Test_CreatePoolMutationDocument, {
      userId,
      teamId,
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

  async publishPool(poolId: string): Promise<Pool> {
    return this.graphqlRequest(Test_PublishPoolMutationDocument, {
      id: poolId,
    }).then((res: GraphQLResponse<"publishPool", Pool>) => res.publishPool);
  }

  async createAndPublishPool({
    userId,
    teamId,
    name,
    classification,
    skill,
  }: CreateAndPublishPoolArgs): Promise<Pool> {
    let pool = await this.createPool(userId, teamId, {
      classifications: { sync: [classification.id] },
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
      essentialSkills: {
        sync: [skill.id],
      },
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

    pool = await this.publishPool(pool.id);

    return pool;
  }
}

export default PoolPage;
