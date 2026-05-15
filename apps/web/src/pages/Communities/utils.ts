import type { RouterContextProvider } from "react-router";

import { graphql } from "@gc-digital-talent/graphql";
import { NotFoundError } from "@gc-digital-talent/helpers";

import { graphqlClientContext, intlContext } from "~/routing/context";

const CommunityTeamMiddleware_Query = graphql(/** GraphQL */ `
  query CommunityTeamMiddleware($id: UUID!) {
    community(id: $id) {
      teamIdForRoleAssignment
    }
  }
`);

export async function getCommunityTeamIdInMiddleware(
  context: Readonly<RouterContextProvider>,
  communityId: string,
) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);

  const res = await client
    .query(CommunityTeamMiddleware_Query, { id: communityId })
    .toPromise();

  if (!res.data?.community?.teamIdForRoleAssignment) {
    throw new NotFoundError(
      intl.formatMessage(
        {
          defaultMessage: "Community {communityId} not found.",
          id: "TfbBB7",
          description: "Message displayed for community not found.",
        },
        { communityId },
      ),
    );
  }

  return res.data.community.teamIdForRoleAssignment;
}
