import { useQuery } from "urql";
import { useMemo } from "react";

import { Role, graphql } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

const TeamMembers_AvailableRolesQuery = graphql(/* GraphQL */ `
  query AvailableUsersRoles {
    roles {
      id
      name
      isTeamBased
      displayName {
        en
        fr
      }
    }
  }
`);

type UseAvailableRolesReturn = {
  roles: Role[];
  fetching: boolean;
};

const useAvailableRoles = (): UseAvailableRolesReturn => {
  const [{ data, fetching }] = useQuery({
    query: TeamMembers_AvailableRolesQuery,
  });

  const roles: Role[] = useMemo(
    () =>
      data?.roles
        ? data.roles
            .filter(notEmpty)
            .filter((role) => role.isTeamBased)
            .filter(
              (role) =>
                ![
                  "community_admin",
                  "community_recruiter",
                  "process_operator",
                ].includes(role.name),
            ) // These roles are meant to be connected to different kinds of Teams.
        : [],
    [data?.roles],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
