import { useQuery } from "urql";

import {
  UserPublicProfile,
  UserPublicProfileFilterInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { TeamMember } from "~/utils/teamUtils";

const TeamMembers_AvailableUsersQuery = graphql(/* GraphQL */ `
  query TeamMembers_AvailableUsers(
    $where: UserPublicProfileFilterInput
    $excludeIds: [ID!]
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    userPublicProfilesPaginated(
      where: $where
      first: $first
      page: $page
      excludeIds: $excludeIds
      orderBy: $orderBy
    ) {
      data {
        id
        firstName
        lastName
        email
      }
      paginatorInfo {
        lastPage
        currentPage
        total
      }
    }
  }
`);

type UseAvailableUsersReturn = {
  users: UserPublicProfile[];
  fetching: boolean;
};

const useAvailableUsers = (
  members: TeamMember[],
  where?: UserPublicProfileFilterInput,
): UseAvailableUsersReturn => {
  const excludeIds = members.map((member) => member.id);
  const [{ data, fetching }] = useQuery({
    query: TeamMembers_AvailableUsersQuery,
    variables: {
      first: 100,
      excludeIds,
      where,
    },
  });

  const users = unpackMaybes(data?.userPublicProfilesPaginated.data);

  return {
    users,
    fetching,
  };
};

export default useAvailableUsers;
