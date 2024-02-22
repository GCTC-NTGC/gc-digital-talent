import { type Page } from "@playwright/test";

import {
  CreatePoolInput,
  Pool,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";

import {
  Test_CreatePoolMutationDocument,
  Test_PublishPoolMutationDocument,
  Test_UpdatePoolMutationDocument,
} from "~/utils/pools";
import { GraphQLResponse } from "~/utils/graphql";

import { AppPage } from "./AppPage";

/**
 * Pool Page
 *
 * Page containing utilities for interacting with pools
 */
export class PoolPage extends AppPage {
  constructor(page: Page) {
    super(page);
  }

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
}
