import { useQuery } from "urql";
import React from "react";

import { UserPublicProfile, graphql } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { TeamMember } from "~/utils/teamUtils";

const TeamMembers_AvailableUsersQuery = graphql(/* GraphQL */ `
  query TeamMembers_AvailableUsers {
    userPublicProfiles {
      id
      firstName
      lastName
      email
    }
  }
`);

type UseAvailableUsersReturn = {
  users: UserPublicProfile[];
  fetching: boolean;
};

const useAvailableUsers = (members: TeamMember[]): UseAvailableUsersReturn => {
  const [{ data, fetching }] = useQuery({
    query: TeamMembers_AvailableUsersQuery,
  });

  const users: UserPublicProfile[] = React.useMemo(
    () =>
      data?.userPublicProfiles
        .filter(
          (user) => !members?.find((teamUser) => teamUser.id === user?.id),
        )
        ?.filter(notEmpty) ?? [],
    [data?.userPublicProfiles, members],
  );

  return {
    users,
    fetching,
  };
};

export default useAvailableUsers;
