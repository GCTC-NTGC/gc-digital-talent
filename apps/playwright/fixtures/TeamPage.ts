import { CreateTeamInput, Team } from "@gc-digital-talent/graphql";

import { Test_CreateTeamMutationDocument } from "~/utils/teams";
import { GraphQLResponse } from "~/utils/graphql";

import AppPage from "./AppPage";

/**
 * Team Page
 *
 * Page containing utilities for interacting with pools
 */
class TeamPage extends AppPage {
  async gotoIndex() {
    await this.page.goto("/admin/teams");
  }

  async createTeam(team: CreateTeamInput): Promise<Team> {
    return this.graphqlRequest(Test_CreateTeamMutationDocument, {
      team,
    }).then((res: GraphQLResponse<"createTeam", Team>) => res.createTeam);
  }
}

export default TeamPage;
