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
}

export default PoolPage;
