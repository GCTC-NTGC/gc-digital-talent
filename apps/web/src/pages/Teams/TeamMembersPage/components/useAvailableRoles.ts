import { useQuery } from "urql";
import React from "react";

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

  const roles: Role[] = React.useMemo(
    () =>
      data?.roles
        ? data.roles.filter(notEmpty).filter((role) => role.isTeamBased)
        : [],
    [data?.roles],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
